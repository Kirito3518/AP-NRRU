"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export function DistributionChart({ data }: { data: { name: string; value: number }[] }) {
  if (!data.length) return <div className="grid h-64 place-items-center text-sm text-muted-foreground">ยังไม่มีข้อมูล</div>;
  return <div className="h-64 w-full"><ResponsiveContainer width="100%" height="100%"><BarChart data={data.slice(0, 8)} margin={{ left: 0, right: 8, top: 10, bottom: 45 }}><CartesianGrid strokeDasharray="3 3" vertical={false} /><XAxis dataKey="name" angle={-25} textAnchor="end" interval={0} height={70} fontSize={11} /><YAxis allowDecimals={false} width={30} /><Tooltip /><Bar dataKey="value" name="จำนวน" fill="#6f42a5" radius={[6, 6, 0, 0]} /></BarChart></ResponsiveContainer></div>;
}
