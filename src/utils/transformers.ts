import { formatDateForDisplay } from "./timeUtils";

export const transformTrendData = (rawData: any[], metric: string) => {
  return rawData.map((item) => ({
    timeLabel: formatDateForDisplay(item.fromtime),
    value: item[metric] || 0,
    fromtime: item.fromtime,
    totime: item.totime,
  }));
};

export const transformContributorData = (
  rawData: any[],
  dimensionValues: string[]
) => {
  return rawData.map((item) => {
    const transformed: any = {
      timeLabel: formatDateForDisplay(item.fromtime),
      fromtime: item.fromtime,
      totime: item.totime,
    };

    dimensionValues.forEach((dimValue) => {
      transformed[dimValue] = item[dimValue] || 0;
    });

    return transformed;
  });
};
