"use client"

import { useEffect, useState } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Search } from "lucide-react"

export default function AdminOrdersPage() {

  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  useEffect(() => {
    async function loadOrders() {
      try {
        const res = await fetch("/api/admin/orders")
        const data = await res.json()
        setOrders(data.orders || [])
      } catch (error) {
        console.error("Failed to load orders", error)
      } finally {
        setLoading(false)
      }
    }

    loadOrders()
  }, [])

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      // Optimistically update the UI to make it feel instantly responsive
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId
            ? { ...order, order_status: newStatus }
            : order
        )
      )

      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      })

      if (!res.ok) {
        throw new Error("Failed to update status")
      }
    } catch (error) {
      console.error("Status update error:", error)
      alert("Failed to update order status")
      // Revert if it failed (you would ideally reload orders here, but this works for now)
    }
  }

  // Filter out orders based on search query
  const filteredOrders = orders.filter(order => {
    const q = searchQuery.toLowerCase()
    const fullName = `${order.customers?.first_name || ""} ${order.customers?.last_name || ""}`.toLowerCase()
    const id = (order.id || "").toLowerCase()
    return fullName.includes(q) || id.includes(q)
  })

  // Sort descending by date, then paginate
  const sortedOrders = filteredOrders.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
  const totalPages = Math.max(1, Math.ceil(sortedOrders.length / itemsPerPage))
  const currentOrders = sortedOrders.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  return (
    <div className="flex flex-col h-[calc(100vh-6rem)] p-2 md:p-6 gap-4">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shrink-0">
        <h1 className="text-2xl font-bold tracking-tight">Orders Management</h1>

        <div className="relative w-full md:w-72">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search by ID or customer name..."
            className="w-full pl-9 bg-white"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value)
              setCurrentPage(1) // reset to page 1 on search
            }}
          />
        </div>
      </div>

      <div className="rounded-md border bg-white flex-1 overflow-hidden  flex flex-col">
        <Table containerClassName="flex-1 overflow-y-auto scrollbar-hidden h-full">
          <TableHeader className="sticky top-0 bg-muted/50 z-10 backdrop-blur-sm ">
            <TableRow>
              <TableHead className="pl-4">Order ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Details</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Payment Method</TableHead>
              <TableHead>Created Date</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {loading ? (
              // Loading Skeleton State
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell className="pl-4"><Skeleton className="h-4 w-20" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                  <TableCell><Skeleton className="h-8 w-40" /></TableCell>
                  <TableCell><Skeleton className="h-8 w-28" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                </TableRow>
              ))
            ) : sortedOrders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-[400px] text-center">
                  <div className="flex flex-col items-center justify-center space-y-3 h-full">
                    <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-2">
                      <Search className="h-8 w-8 text-muted-foreground opacity-50" />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                      {searchQuery ? "No orders match your search" : "No orders yet"}
                    </h3>
                    <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                      {searchQuery 
                        ? "Try adjusting your search term to find what you're looking for." 
                        : "When customers book dumpsters, their orders will appear here for you to manage."}
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              currentOrders.map((order: any) => (
                <TableRow key={order.id} className="group transition-colors hover:bg-muted/30">
                  <TableCell className="font-medium pl-4">
                    <span className="truncate block text-[13px] max-w-[120px] font-mono text-muted-foreground group-hover:text-foreground transition-colors" title={order.id}>
                      {order.id.split('-')[0]}
                    </span>
                  </TableCell>
                  <TableCell className="font-medium">
                    {order.customers?.first_name} {order.customers?.last_name}
                  </TableCell>
                  <TableCell>
                    {order.order_services && order.order_services.length > 0 ? (
                      <div className="flex flex-col gap-2">
                        {order.order_services.map((service: any, idx: number) => (
                          <div key={idx} className="text-sm border-l-2 border-primary/20 pl-2">
                            <span className="font-semibold">{service.dumpster_size} Yard</span>{' '}
                            <span className="text-muted-foreground">{service.dumpster_type?.replace(/_/g, ' ')}</span>
                            <div className="text-xs text-muted-foreground mt-0.5">
                              Delivery: <span className="text-foreground font-medium">{new Date(service.delivery_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <span className="text-muted-foreground italic text-sm">N/A</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Select
                      value={order.order_status}
                      onValueChange={(value) => handleStatusChange(order.id, value)}
                    >
                      <SelectTrigger className="w-[140px] h-8 text-xs font-medium">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="CONFIRMED">Confirmed</SelectItem>
                        <SelectItem value="IN_TRANSIT">In Transit</SelectItem>
                        <SelectItem value="DELIVERED">Delivered</SelectItem>
                        <SelectItem value="COMPLETED">Completed</SelectItem>
                        <SelectItem value="CANCELLED">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell className="font-medium text-emerald-600 dark:text-emerald-400">
                    ${Number(order.total_amount).toFixed(2)}
                  </TableCell>
                  <TableCell>
                    {order.payment_webhooks && order.payment_webhooks.length > 0 ? (
                      <div className="text-sm flex flex-col">
                        <span>
                          {order.payment_webhooks[0].gateway === 'google-pay' ? 'Google Pay' :
                            order.payment_webhooks[0].gateway === 'stripe_checkout' ? 'Stripe Checkout' :
                              order.payment_webhooks[0].gateway}
                        </span>
                        {order.payment_webhooks[0].payload?.paymentMethodData?.info?.cardNetwork && (
                          <span className="text-xs text-muted-foreground uppercase tracking-wide">
                            {order.payment_webhooks[0].payload.paymentMethodData.info.cardNetwork}
                          </span>
                        )}
                      </div>
                    ) : (
                      <span className="text-muted-foreground italic text-sm">N/A</span>
                    )}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {new Date(order.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Controls */}
      {!loading && sortedOrders.length > 0 && (
        <div className="flex items-center justify-between shrink-0 bg-white p-3 rounded-md border ">
          <div className="text-sm text-muted-foreground font-medium">
            Showing <span className="text-foreground">{(currentPage - 1) * itemsPerPage + 1}</span> to <span className="text-foreground">{Math.min(currentPage * itemsPerPage, sortedOrders.length)}</span> of <span className="text-foreground">{sortedOrders.length}</span> results
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage >= totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}

    </div>
  )
}