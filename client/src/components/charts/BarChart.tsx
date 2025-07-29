import { Bar, BarChart as RechartsBarChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";

interface BarChartProps {
  data: Array<{
    name: string;
    [key: string]: string | number;
  }>;
  dataKeys: Array<{
    key: string;
    name: string;
    color: string;
  }>;
  height?: number;
}

export function BarChart({ data, dataKeys, height = 300 }: BarChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsBarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        {dataKeys.map((dataKey) => (
          <Bar
            key={dataKey.key}
            dataKey={dataKey.key}
            name={dataKey.name}
            fill={dataKey.color}
          />
        ))}
      </RechartsBarChart>
    </ResponsiveContainer>
  );
}