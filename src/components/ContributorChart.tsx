import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { COLORS } from "../utils/constants";

const ContributorChart: React.FC<{
  data: any[];
  dimensionValues: string[];
}> = ({ data, dimensionValues }) => {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="timeLabel" />
        <YAxis />
        <Tooltip />
        <Legend />
        {dimensionValues.map((dimValue, index) => (
          <Bar
            key={dimValue}
            dataKey={dimValue}
            stackId="a"
            fill={COLORS[index % COLORS.length]}
          />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
};

export default ContributorChart;
