"use client";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from "recharts";
import type { TestResult } from "@/lib/scoreCalculator";

interface ProgressChartProps {
  results: TestResult[];
}

export default function ProgressChart({ results }: ProgressChartProps) {
  const itpResults = results.filter((r) => r.examType === "ITP");

  const data = itpResults.map((r) => ({
    date: new Date(r.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    Total: r.score.total,
    Listening: r.score.listening.scaled,
    Structure: r.score.structure.scaled,
    Reading: r.score.reading.scaled,
  }));

  return (
    <div className="bg-white rounded-2xl border border-neutral-200 p-6">
      <h3 className="font-heading font-700 text-neutral-900 text-base mb-5">Score Progress</h3>
      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 11, fill: "#6B7280" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              domain={[310, 677]}
              tick={{ fontSize: 11, fill: "#6B7280" }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{
                borderRadius: "12px",
                border: "1px solid #E5E7EB",
                fontSize: "12px",
                boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
              }}
            />
            <Legend wrapperStyle={{ fontSize: "11px" }} />
            <Line
              type="monotone"
              dataKey="Total"
              stroke="#007D07"
              strokeWidth={3}
              dot={{ fill: "#007D07", r: 5 }}
              activeDot={{ r: 7 }}
            />
            <Line type="monotone" dataKey="Listening" stroke="#8B5CF6" strokeWidth={1.5} strokeDasharray="4 2" dot={false} />
            <Line type="monotone" dataKey="Structure" stroke="#3B82F6" strokeWidth={1.5} strokeDasharray="4 2" dot={false} />
            <Line type="monotone" dataKey="Reading" stroke="#10B981" strokeWidth={1.5} strokeDasharray="4 2" dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
