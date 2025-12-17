export const calculateTimeRange = (days: number): { fromTime: Date; toTime: Date } => {
  const toTime = new Date();
  const fromTime = new Date();
  fromTime.setDate(toTime.getDate() - days);
  return { fromTime, toTime };
};

export const formatDate = (date: Date): string => {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};

export const formatDateForDisplay = (dateStr: string): string => {
  if (!dateStr) return "";
  const parts = dateStr.split("-");
  if (parts.length === 3) {
    return `${parts[1]}/${parts[0]}`;
  }
  return dateStr;
};
