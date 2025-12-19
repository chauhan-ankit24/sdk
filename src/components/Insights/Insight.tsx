import React, { useState, useEffect, useCallback } from "react";
import { calculateTimeRange } from "../../utils/timeUtils";
import {
  transformTrendData,
  transformContributorData,
} from "../../utils/transformers";
import { i18n } from "../../utils/i18n";
import { InsightProps } from "../../types";
import ErrorState from "../../states/ErrorState/ErrorState";
import EmptyState from "../../states/EmptyState/EmptyState";
import LoaderState from "../../states/LoaderState/LoaderState";
import TrendChart from "../TrendChart";
import ContributorChart from "../ContributorChart";
import InsightCache from "../../cache/InsightCache";
import { InsightErrorBoundary } from "../../error-boundary/ErrorBoundary";
import "./Insight.css";

export const Insight: React.FC<InsightProps> = (props) => {
  const {
    type,
    metric,
    timeGrain,
    timeRange,
    dataResolver,
    width = "100%",
    height = "400px",
    refreshInterval = 0,
  } = props;
  const [data, setData] = useState<any[]>([]);
  const [dimensionValues, setDimensionValues] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(
    async (isAutoRefresh = false) => {
      if (props.type === "contributor") {
        if (!props.dimension || !props.dimensionValuesResolver) {
          setError(i18n.configurationError);
          setLoading(false);
          return;
        }
      }
      const currentProps = {
        type,
        metric,
        dimension: (props as any).dimension,
        timeGrain,
        timeRange,
      };
      const cacheKey = InsightCache.generateKey(currentProps);

      if (!isAutoRefresh) {
        const cachedEntry = InsightCache.get(cacheKey) as any;
        if (cachedEntry && cachedEntry.data) {
          console.log(`[SDK Cache] Hit for ${type}:`, cacheKey);

          setData(cachedEntry.data);

          if (props.type === "contributor" && cachedEntry.dims) {
            setDimensionValues(cachedEntry.dims);
          }

          setLoading(false);
          return;
        }
      }

      try {
        if (!isAutoRefresh) setLoading(true);
        setError(null);

        const { fromTime, toTime } = calculateTimeRange(timeRange);

        let dims: string[] = [];
        if (
          props.type === "contributor" &&
          props.dimension &&
          props.dimensionValuesResolver
        ) {
          dims = await props.dimensionValuesResolver(metric, props.dimension);
          setDimensionValues(dims);
        }

        const rawData = await dataResolver(metric, timeGrain, fromTime, toTime);

        if (!rawData || rawData.length === 0) {
          setData([]);
          return;
        }

        const transformedData =
          type === "trend"
            ? transformTrendData(rawData, metric)
            : transformContributorData(rawData, dims);

        const cachePayload = {
          data: transformedData,
          dims: props.type === "contributor" ? dims : undefined,
        };

        InsightCache.set(cacheKey, cachePayload);

        setData(transformedData);
      } catch (err) {
        setError(err instanceof Error ? err.message : i18n.failedToLoadData);
      } finally {
        setLoading(false);
      }
    },
    [
      type,
      metric,
      (props as any).dimension,
      timeGrain,
      timeRange,
      dataResolver,
      (props as any).dimensionValuesResolver,
    ]
  );

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (refreshInterval <= 0) return;

    const intervalId = setInterval(() => {
      fetchData(true);
    }, refreshInterval);

    return () => clearInterval(intervalId);
  }, [refreshInterval, fetchData]);

  if (loading) {
    return <LoaderState type={type} />;
  }

  if (error) {
    return <ErrorState error={error} />;
  }

  if (data.length === 0) {
    return <EmptyState />;
  }
  return (
    <div
      className="insight-container"
      style={{ width, height }}
    >
      <div className="insight-header">
        <h3 className="insight-title">
          {type} {i18n.insightLabel} {metric}
        </h3>
        <p className="insight-subtitle">
          {timeGrain} {i18n.dataForLast} {timeRange} {i18n.days}
          {(props as any).dimension && (
            <span className="insight-dimension">
              {i18n.by} {(props as any).dimension}
            </span>
          )}
        </p>
      </div>

      <div className="insight-chart-container">
        <InsightErrorBoundary
          fallback={<ErrorState error={i18n.visualizationFailedToRender} />}
        >
          {type === "trend" ? (
            <TrendChart data={data} metric={metric} />
          ) : (
            <ContributorChart data={data} dimensionValues={dimensionValues} />
          )}
        </InsightErrorBoundary>
      </div>
    </div>
  );
};
