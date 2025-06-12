"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts"
import { TrendingUp, TrendingDown } from "lucide-react"
import { motion } from "framer-motion"

interface MonthlyComparisonChartProps {
  currentMonth: number
  lastMonth: number
  growthPercentage: number
}

export function MonthlyComparisonChart({ currentMonth, lastMonth, growthPercentage }: MonthlyComparisonChartProps) {
  const data = [
    {
      period: "Tháng trước",
      count: lastMonth,
      color: "#94a3b8",
    },
    {
      period: "Tháng này",
      count: currentMonth,
      color: "#6366f1",
    },
  ]

  const isPositiveGrowth = growthPercentage >= 0
  const growthColor = isPositiveGrowth ? "text-emerald-500" : "text-rose-500"
  const growthBg = isPositiveGrowth ? "bg-emerald-50" : "bg-rose-50"
  const growthBorder = isPositiveGrowth ? "border-emerald-200" : "border-rose-200"

  const maxValueraw = Math.max(currentMonth, lastMonth) * 1.2 

  const maxValue = maxValueraw.toFixed(0)

  return (
    <Card className="border-none shadow-md overflow-hidden">
      <CardHeader className="pb-2 bg-gradient-to-r from-slate-50 to-white">
        <CardTitle className="text-xl font-semibold text-slate-800">So sánh theo tháng</CardTitle>
        <CardDescription className="text-slate-500">Tài liệu mới được tạo tháng này so với tháng trước</CardDescription>
      </CardHeader>
      <CardContent className="pt-4">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6 flex items-center justify-between"
        >
          <div className={`flex items-center space-x-2 px-3 py-2 rounded-lg border ${growthBorder} ${growthBg}`}>
            {isPositiveGrowth ? (
              <TrendingUp className={`h-5 w-5 ${growthColor}`} />
            ) : (
              <TrendingDown className={`h-5 w-5 ${growthColor}`} />
            )}
            <span className={`text-base font-semibold ${growthColor}`}>
              {growthPercentage > 0 ? "+" : ""}
              {growthPercentage}%
            </span>
            <span className="text-sm text-slate-600">so với tháng trước</span>
          </div>
        </motion.div>

        <div className="h-[220px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 20 }} barGap={8}>
              <defs>
                <linearGradient id="colorLastMonth" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#94a3b8" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#94a3b8" stopOpacity={0.6} />
                </linearGradient>
                <linearGradient id="colorCurrentMonth" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0.6} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-slate-200" />
              <XAxis
                dataKey="period"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#64748b", fontSize: 12 }}
                dy={10}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#64748b", fontSize: 12 }}
                dx={-10}
                domain={[0, maxValue]}
              />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    const isCurrentMonth = label === "Tháng này"
                    const color = isCurrentMonth ? "#6366f1" : "#94a3b8"

                    return (
                      <div className="rounded-lg border bg-white p-3 shadow-lg border-slate-100">
                        <p className="font-medium text-slate-800 mb-1">{label}</p>
                        <div className="flex items-center text-sm">
                          <span className="h-3 w-3 rounded-full mr-2" style={{ backgroundColor: color }}></span>
                          <span className="text-slate-600">Tài liệu: </span>
                          <span className="font-semibold text-slate-800 ml-1">{payload[0]?.value}</span>
                        </div>
                      </div>
                    )
                  }
                  return null
                }}
                wrapperStyle={{ outline: "none" }}
              />
              <Bar dataKey="count" radius={[4, 4, 0, 0]} animationDuration={1500}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={index === 0 ? "url(#colorLastMonth)" : "url(#colorCurrentMonth)"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-6 grid grid-cols-2 gap-6 text-center"
        >
          <div className="bg-slate-50 p-3 rounded-lg">
            <p className="text-sm text-slate-500 mb-1">Tháng trước</p>
            <p className="text-xl font-bold text-slate-700">{lastMonth}</p>
          </div>
          <div className="bg-indigo-50 p-3 rounded-lg">
            <p className="text-sm text-indigo-600 mb-1">Tháng này</p>
            <p className="text-xl font-bold text-indigo-700">{currentMonth}</p>
          </div>
        </motion.div>
      </CardContent>
    </Card>
  )
}
