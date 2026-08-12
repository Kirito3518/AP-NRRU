"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { Card } from "@/components/ui/card";

type Props = { total: number; active: number; problem: number; maintenance: number; missing: number };
const config = [
  { key: "active", label: "ใช้งาน", color: "#16a34a" },
  { key: "problem", label: "มีปัญหา", color: "#dc2626" },
  { key: "maintenance", label: "ซ่อมบำรุง", color: "#d97706" },
  { key: "missing", label: "สูญหาย", color: "#78716c" },
] as const;

export function StatusDonut(props: Props) {
  const data = config.map((item) => ({ ...item, value: props[item.key] })).filter((item) => item.value > 0);
  return <Card className="p-5">
    <h3 className="text-sm font-semibold">สัดส่วนสถานะ</h3>
    <div className="h-48"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={data} dataKey="value" nameKey="label" innerRadius={48} outerRadius={72} strokeWidth={0}>{data.map((item) => <Cell key={item.key} fill={item.color} />)}</Pie><Tooltip /></PieChart></ResponsiveContainer></div>
    <div className="space-y-2">{config.map((item) => <div key={item.key} className="flex items-center justify-between text-sm"><span className="flex items-center gap-2 text-muted-foreground"><span className="size-2 rounded-full" style={{ backgroundColor: item.color }} />{item.label}</span><strong>{props[item.key]} <span className="font-normal text-muted-foreground">({props.total ? Math.round(props[item.key] / props.total * 100) : 0}%)</span></strong></div>)}</div>
  </Card>;
}
