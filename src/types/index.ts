export type InsightType = "trend" | "contributor";
export type TimeGrain = "daily" | "weekly" | "monthly";

interface BaseInsightProps {
  metric: string;
  timeGrain: TimeGrain;
  timeRange: number;
  dataResolver: (
    metric: string,
    grain: TimeGrain,
    fromTime: Date,
    toTime: Date
  ) => Promise<any[]>;
  width?: string | number;
  height?: string | number;
  refreshInterval?: number;
}

interface TrendInsightProps extends BaseInsightProps {
  type: "trend";
}

interface ContributorInsightProps extends BaseInsightProps {
  type: "contributor";
  dimension: string;
  dimensionValuesResolver: (
    metric: string,
    dimension: string
  ) => Promise<string[]>;
}

export type InsightProps = TrendInsightProps | ContributorInsightProps;
