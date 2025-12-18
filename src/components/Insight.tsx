import React, { useState, useEffect, useCallback } from "react";
import { InsightProps } from "../types";
import { calculateTimeRange } from "../utils/timeUtils";
import {
  transformTrendData,
  transformContributorData,
} from "../utils/transformers";
import ErrorState from "../states/error";
import EmptyState from "../states/empty";
import LoaderState from "../states/loader";
import TrendChart from "./TrendChart";
import ContributorChart from "./ContributorChart";
import InsightCache from "../cache/InsightCache";
import { InsightErrorBoundary } from "../errorBoundary/ErrorBoundary";

export const Insight: React.FC<InsightProps> = ({
  type,
  metric,
  dimension,
  timeGrain,
  timeRange,
  dataResolver,
  dimensionValuesResolver,
  width = "100%",
  height = "400px",
  refreshInterval = 0,
}) => {
  const [data, setData] = useState<any[]>([]);
  const [dimensionValues, setDimensionValues] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  if (loading) {
    return <LoaderState type={type} />;
  }

  if (error) {
    return <ErrorState error={error} />;
  }

  if (data.length === 0) {
    return <EmptyState />;
  }

  useEffect(() => {
    if (type === "contributor") {
      if (!dimension) {
        setError("dimension is required for contributor insights");
        setLoading(false);
        return;
      }
      if (!dimensionValuesResolver) {
        setError(
          "dimensionValuesResolver is required for contributor insights"
        );
        setLoading(false);
        return;
      }
    }
  }, [type, dimension, dimensionValuesResolver]);

  const fetchData = useCallback(
    async (isAutoRefresh = false) => {
      const currentProps = { type, metric, dimension, timeGrain, timeRange };
      const cacheKey = InsightCache.generateKey(currentProps);

      if (!isAutoRefresh) {
        const cachedEntry = InsightCache.get(cacheKey) as any;
        if (cachedEntry && cachedEntry.data) {
          console.log(`[SDK Cache] Hit for ${type}:`, cacheKey);

          setData(cachedEntry.data);

          if (type === "contributor" && cachedEntry.dims) {
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
        if (type === "contributor" && dimension && dimensionValuesResolver) {
          dims = await dimensionValuesResolver(metric, dimension);
          setDimensionValues(dims);
        }

        const rawData = await dataResolver(metric, timeGrain, fromTime, toTime);

        if (!rawData || rawData.length === 0) {
          setData([]);
          if (!isAutoRefresh) setError("Empty");
          return;
        }

        const transformedData =
          type === "trend"
            ? transformTrendData(rawData, metric)
            : transformContributorData(rawData, dims);

        const cachePayload = {
          data: transformedData,
          dims: type === "contributor" ? dims : undefined,
        };

        InsightCache.set(cacheKey, cachePayload);

        setData(transformedData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load data");
      } finally {
        setLoading(false);
      }
    },
    [
      type,
      metric,
      dimension,
      timeGrain,
      timeRange,
      dataResolver,
      dimensionValuesResolver,
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

  return (
    <div
      style={{
        width: width,
        height: height,
        backgroundColor: "white",
        borderRadius: "12px",
        boxShadow:
          "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
        border: "1px solid #e5e7eb",
        padding: "24px",
        transition: "all 0.2s ease-in-out",
        display: "flex",
        flexDirection: "column",
        boxSizing: "border-box",
      }}
    >
      <div style={{ marginBottom: "20px", flexShrink: 0 }}>
        <h3
          style={{
            fontSize: "18px",
            fontWeight: 700,
            color: "#111827",
            textTransform: "capitalize",
            margin: 0,
          }}
        >
          {type} Insight: {metric}
        </h3>
        <p
          style={{
            fontWeight: 400,
            color: "#9ca3af",
            fontSize: "14px",
            margin: "4px 0 0 0",
          }}
        >
          {timeGrain} data for last {timeRange} days
          {dimension && (
            <span
              style={{ marginLeft: "6px", color: "#2563eb", fontWeight: 500 }}
            >
              by {dimension}
            </span>
          )}
        </p>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          flex: 1,
          width: "100%",
          minHeight: "300px",
          height: "350px",
        }}
      >
        <InsightErrorBoundary
          fallback={<ErrorState error="Visualization failed to render" />}
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
