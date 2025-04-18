import React, { useState, useMemo } from "react"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"
import axios from "axios"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/Components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/Components/ui/chart"

import { useOnceEffect } from "@/hooks/useeffectOnce"

const chartConfig = {
  views: {
    label: "People Booked",
  },
  Property: {
    label: "Property",
    color: "hsl(var(--chart-1))",
  },
  Event: {
    label: "Event",
    color: "hsl(var(--chart-2))",
  },
}

export default function Linechart() {
  const [activeChart, setActiveChart] = useState("Property")
  const [chartData, setChartData] = useState([])

  useOnceEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          "http://localhost:8000/api/graphs/line-graph",
          { withCredentials: true }
        )
        setChartData(res.data)
      } catch (error) {
        console.error("Error fetching chart data", error)
      }
    }
    fetchData()
  })

  const total = useMemo(() => {
    if (!chartData || chartData.length === 0)
      return { Property: 0, Event: 0 }
    return {
      Property: chartData.reduce((acc, curr) => acc + (curr.Property || 0), 0),
      Event: chartData.reduce((acc, curr) => acc + (curr.Event || 0), 0),
    }
  }, [chartData])

  return (
    <Card>
      <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
          <CardTitle>Bar Chart - Interactive</CardTitle>
          <CardDescription>
            Showing total Booking for the last 3 months
          </CardDescription>
        </div>
        <div className="flex">
          {["Property", "Event"].map((key) => (
            <button
              key={key}
              data-active={activeChart === key}
              className="relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l data-[active=true]:bg-muted/50 sm:border-l sm:border-t-0 sm:px-8 sm:py-6"
              onClick={() => setActiveChart(key)}
            >
              <span className="text-xs text-muted-foreground">
                {chartConfig[key].label}
              </span>
              <span className="text-lg font-bold leading-none sm:text-3xl">
                {total[key]?.toLocaleString() || 0}
              </span>
            </button>
          ))}
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <BarChart
            accessibilityLayer
            data={chartData}
            margin={{ left: 12, right: 12 }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value)
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })
              }}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-[150px]"
                  nameKey="views"
                  labelFormatter={(value) =>
                    new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })
                  }
                />
              }
            />
            <Bar dataKey={activeChart} fill={`var(--color-${activeChart})`} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
