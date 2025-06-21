"use client"

import { useEffect, useState } from "react"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"
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
import axios from "axios"
import axiosInstance from "@/utils/axios-instance"

const chartConfig = {
  property: {
    label: "Property",
    color: "hsl(var(--chart-1))",
  },
  event: {
    label: "Event",
    color: "hsl(var(--chart-2))",
  },
}

export default function Component({id}) {
  const [chartData, setChartData] = useState([])


  useOnceEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axiosInstance.get(`/graphs/monthly-payments/${id}`,{withCredentials:true})
        setChartData(res.data)
        
      } catch (error) {
        console.error("Error fetching chart data:", error)
      }
    }
    fetchData()
  })

  console.log(id);
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Monthly Payments</CardTitle>
        <CardDescription>Last 12 Months</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={chartData ||[]}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dashed" />}
            />
            <Bar dataKey="property" fill="var(--color-property)" radius={4} />
            <Bar dataKey="event" fill="var(--color-event)" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

