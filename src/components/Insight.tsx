import React, { useState, useEffect } from "react";
import { InsightProps } from "../types";
import { calculateTimeRange } from "../utils/timeUtils";
import {
  transformTrendData,
  transformContributorData,
} from "../utils/transformers";
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
  width = "100%",
  height = "400px",
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
      <div
        style={{
          width: "100%",
          height: "100%",
          backgroundColor: "white",
          borderRadius: "12px",
          border: "1px solid #e5e7eb",
          padding: "24px",
          display: "flex",
          flexDirection: "column",
          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            height: "24px",
            width: "192px",
            backgroundColor: "#f3f4f6",
            animation: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
            marginBottom: "8px",
            borderRadius: "4px",
          }}
        ></div>
        <div
          style={{
            height: "16px",
            width: "128px",
            backgroundColor: "#f9fafb",
            animation: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
            marginBottom: "32px",
            borderRadius: "4px",
          }}
        ></div>
        <div
          style={{
            display: "flex",
            alignItems: "end",
            gap: "12px",
            flex: 1,
            minHeight: 0,
          }}
        >
          <div
            style={{
              backgroundColor: "#f9fafb",
              animation: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
              flex: 1,
              borderRadius: "4px 4px 0 0",
              height: "60%",
            }}
          ></div>
          <div
            style={{
              backgroundColor: "#f9fafb",
              animation: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
              flex: 1,
              borderRadius: "4px 4px 0 0",
              height: "80%",
            }}
          ></div>
          <div
            style={{
              backgroundColor: "#f9fafb",
              animation: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
              flex: 1,
              borderRadius: "4px 4px 0 0",
              height: "40%",
            }}
          ></div>
          <div
            style={{
              backgroundColor: "#f9fafb",
              animation: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
              flex: 1,
              borderRadius: "4px 4px 0 0",
              height: "90%",
            }}
          ></div>
          <div
            style={{
              backgroundColor: "#f9fafb",
              animation: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
              flex: 1,
              borderRadius: "4px 4px 0 0",
              height: "70%",
            }}
          ></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{
          width: "100%",
          height: "100%",
          backgroundColor: "#fef2f2",
          borderRadius: "12px",
          border: "1px solid #fca5a5",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "24px",
          boxSizing: "border-box",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              backgroundColor: "#fee2e2",
              padding: "12px",
              borderRadius: "50%",
              display: "inline-block",
              marginBottom: "16px",
            }}
          >
            <svg
              style={{ width: "32px", height: "32px", color: "#dc2626" }}
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
          </div>
          <p style={{ color: "#dc2626", fontWeight: 500 }}>{error}</p>
        </div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div
        style={{
          width: "100%",
          height: "100%",
          backgroundColor: "#f9fafb",
          borderRadius: "12px",
          border: "1px solid #e5e7eb",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "24px",
          boxSizing: "border-box",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <svg
            style={{
              width: "3rem",
              height: "3rem",
              color: "#9ca3af",
              margin: "0 auto 1rem auto",
            }}
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
          <p style={{ color: "#4b5563" }}>No data available for this insight</p>
        </div>
      </div>
    );
  }

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
        }}
      >
        {type === "trend" ? (
          <TrendChart data={data} metric={metric} />
        ) : (
          <ContributorChart data={data} dimensionValues={dimensionValues} />
        )}
      </div>
    </div>
  );
};
