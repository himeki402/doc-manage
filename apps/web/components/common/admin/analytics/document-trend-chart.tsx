"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts"
import { format, parseISO } from "date-fns"
import { vi } from "date-fns/locale"
import type { DocumentsByDay } from "@/lib/types/document"
import { motion } from "framer-motion"

interface DocumentTrendChartProps {
  data: DocumentsByDay[]
}

export function DocumentTrendChart({ data }: DocumentTrendChartProps) {
  if (!data || !Array.isArray(data) || data.length === 0) {
    return (
      <Card className="border-none shadow-md">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl font-semibold text-slate-800">Xu hướng tài liệu</CardTitle>
          <CardDescription className="text-slate-500">Số lượng tài liệu được tạo trong 30 ngày qua</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-[300px] text-slate-400">Không có dữ liệu để hiển thị</div>
        </CardContent>
      </Card>
    )
  }

  // Chuyển đổi dữ liệu để hiển thị đúng định dạng
  const chartData = data.map((item) => ({
    ...item,
    formattedDate: format(parseISO(item.date), "dd/MM", { locale: vi }),
    fullDate: format(parseISO(item.date), "dd/MM/yyyy", { locale: vi }),
  }))

  // Tính toán tổng số tài liệu trong khoảng thời gian
  const totalInPeriod = data.reduce((sum, item) => sum + item.count, 0)

  // Tính trung bình mỗi ngày
  const averagePerDay = data.length > 0 ? Math.round(totalInPeriod / data.length) : 0

  // Find max value for better visualization
  const maxCount = Math.max(...data.map((item) => item.count))

  return (
    <Card >
      <CardHeader className="pb-2 bg-gradient-to-r from-slate-50 to-white">
        <CardTitle className="text-xl font-semibold text-slate-800">Xu hướng tài liệu</CardTitle>
        <CardDescription className="text-slate-500">Số lượng tài liệu được tạo trong 30 ngày qua</CardDescription>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="mb-6 flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-1 bg-slate-50 p-3 rounded-lg"
          >
            <p className="text-sm text-slate-500">Tổng cộng 30 ngày</p>
            <p className="text-2xl font-bold text-slate-800">{totalInPeriod}</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-1 text-right bg-slate-50 p-3 rounded-lg"
          >
            <p className="text-sm text-slate-500">Trung bình/ngày</p>
            <p className="text-2xl font-bold text-slate-800">{averagePerDay}</p>
          </motion.div>
        </div>

        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-slate-200" />
              <XAxis
                dataKey="formattedDate"
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
                domain={[0, maxCount * 1.2]}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0]?.payload
                    return (
                      <div className="rounded-lg border bg-white p-3 shadow-lg border-slate-100">
                        <p className="font-medium text-slate-800 mb-1">{data.fullDate}</p>
                        <div className="flex items-center text-sm">
                          <span className="h-3 w-3 rounded-full bg-indigo-500 mr-2"></span>
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
              <Area
                type="monotone"
                dataKey="count"
                stroke="#6366f1"
                strokeWidth={3}
                fill="url(#colorCount)"
                animationDuration={1500}
                dot={{
                  fill: "white",
                  stroke: "#6366f1",
                  strokeWidth: 2,
                  r: 4,
                }}
                activeDot={{
                  r: 6,
                  fill: "#6366f1",
                  stroke: "white",
                  strokeWidth: 2,
                }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
