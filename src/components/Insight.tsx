import React, { useState, useEffect } from "react";
import { InsightProps } from "../types";
import { calculateTimeRange } from "../utils/timeUtils";
import { transformTrendData, transformContributorData } from "../utils/transformers";
import TrendChart from "./TrendChart";
import ContributorChart from "./ContributorChart";

export const Insight: React.FC<InsightProps> = ({
  type,
  metric,
  dimension,
  timeGrain,
  timeRange,
  dataResolver,
  dimensionValuesResolver,
}) => {
  const [data, setData] = useState<any[]>([]);
  const [dimensionValues, setDimensionValues] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Validate props
  useEffect(() => {
    if (type === "contributor" && !dimension) {
      setError("Dimension is required for contributor insights");
      setLoading(false);
    } else if (type === "contributor" && !dimensionValuesResolver) {
      setError("dimensionValuesResolver is required for contributor insights");
      setLoading(false);
    }
  }, [type, dimension, dimensionValuesResolver]);

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const { fromTime, toTime } = calculateTimeRange(timeRange);

        // Fetch dimension values for contributor insights
        let dims: string[] = [];
        if (type === "contributor" && dimension && dimensionValuesResolver) {
          dims = await dimensionValuesResolver(metric, dimension);
          setDimensionValues(dims);
        }

        // Fetch the actual data
        const rawData = await dataResolver(metric, timeGrain, fromTime, toTime);

        if (!rawData || rawData.length === 0) {
          setError("No data available for the selected time range");
          setData([]);
          setLoading(false);
          return;
        }

        // Transform data based on insight type
        const transformedData =
          type === "trend"
            ? transformTrendData(rawData, metric)
            : transformContributorData(rawData, dims);

        setData(transformedData);
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load data");
        setLoading(false);
      }
    };

    if (!error) {
      fetchData();
    }
  }, [
    type,
    metric,
    dimension,
    timeGrain,
    timeRange,
    dataResolver,
    dimensionValuesResolver,
  ]);

  // Render states
  if (loading) {
    return (
      <div className="flex items-center justify-center h-96 bg-gray-50 rounded-lg border border-gray-200">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading insight...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-96 bg-red-50 rounded-lg border border-red-200">
        <div className="text-center p-6">
          <svg
            className="w-12 h-12 text-red-500 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <p className="text-red-700 font-medium">{error}</p>
        </div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-96 bg-gray-50 rounded-lg border border-gray-200">
        <div className="text-center p-6">
          <svg
            className="w-12 h-12 text-gray-400 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <p className="text-gray-600">No data available for this insight</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900 capitalize">
          {type} Insight: {metric}
        </h3>
        <p className="text-sm text-gray-500 mt-1">
          {timeGrain} data for last {timeRange} days
          {dimension && ` by ${dimension}`}
        </p>
      </div>

      {type === "trend" ? (
        <TrendChart data={data} metric={metric} />
      ) : (
        <ContributorChart data={data} dimensionValues={dimensionValues} />
      )}
    </div>
  );
};
