export type InsightType = "trend" | "contributor";
export type TimeGrain = "daily" | "weekly" | "monthly";

export interface InsightProps {
  type: InsightType;
  metric: string;
  dimension?: string;
  timeGrain: TimeGrain;
  timeRange: number;
  dataResolver: (
    metric: string,
    grain: TimeGrain,
    fromTime: Date,
    toTime: Date
  ) => Promise<any[]>;
  dimensionValuesResolver?: (
    metric: string,
    dimension: string
  ) => Promise<string[]>;
  width?: string | number;
  height?: string | number;
}
