"use client"
import { useEffect, useState } from "react"
import { ChartAreaInteractive } from "@/components/chart-area-interactive"
import { SectionCards } from "@/components/section-cards"
import { Skeleton } from "@/components/ui/skeleton"

export default function AnalyticsPage() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        const res = await fetch("/api/admin/dashboard")
        const json = await res.json()
        if (json.success) {
          setData(json.data)
        }
      } catch (err) {
        console.error("Failed to fetch analytics data", err)
      } finally {
        setLoading(false)
      }
    }
    fetchDashboardData()
  }, [])

  if (loading || !data) {
    return (
      <div className="flex flex-1 flex-col gap-4 p-2 md:p-6">
        <h1 className="text-2xl font-bold tracking-tight mb-2">Analytics</h1>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
          <Skeleton className="h-[120px] w-full rounded-xl" />
          <Skeleton className="h-[120px] w-full rounded-xl" />
          <Skeleton className="h-[120px] w-full rounded-xl" />
          <Skeleton className="h-[120px] w-full rounded-xl" />
        </div>
        <Skeleton className="h-[400px] w-full rounded-xl" />
      </div>
    )
  }

  return (
    <div className="flex flex-1 flex-col p-2 md:p-6 gap-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shrink-0">
        <h1 className="text-2xl font-bold tracking-tight">Analytics Dashboard</h1>
      </div>

      <div className="flex flex-col gap-6">
        {/* Top level KPIs */}
        <div className="-mx-4 md:mx-0">
           <SectionCards metrics={data.metrics} />
        </div>

        {/* Interactive Charts */}
        <div className="grid grid-cols-1 gap-6">
          <ChartAreaInteractive chartData={data.chartData} />
        </div>
      </div>
    </div>
  )
}
