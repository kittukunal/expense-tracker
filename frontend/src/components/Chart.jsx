import React from "react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  Tooltip,
} from "recharts";

const COLORS = ["#00C49F", "#FF8042"]; // income - green, expense - orange

const Chart = ({ income = 0, expense = 0 }) => {
  const chartData = [
    { name: "Income", value: income },
    { name: "Expense", value: expense },
  ];

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={chartData}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={80}
          label
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend
          verticalAlign="top"
          align="right"
          layout="vertical"
          wrapperStyle={{ marginTop: -1, marginRight: -1 }}
        />



      </PieChart>
    </ResponsiveContainer>
  );
};

export default Chart;
