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

export default function AdminInvoicesPage() {

  const [invoices, setInvoices] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  useEffect(() => {
    async function loadInvoices() {
      try {
        const res = await fetch("/api/admin/invoices")
        const data = await res.json()
        if (data.success) {
          setInvoices(data.invoices || [])
        }
      } catch (error) {
        console.error("Failed to load invoices", error)
      } finally {
        setLoading(false)
      }
    }

    loadInvoices()
  }, [])

  const handleStatusChange = async (invoiceId: string, newStatus: string) => {
    try {
      // Optimistically update the UI
      setInvoices((prevInvoices) =>
        prevInvoices.map((inv) =>
          inv.id === invoiceId
            ? { ...inv, status: newStatus }
            : inv
        )
      )

      const res = await fetch(`/api/admin/invoices/${invoiceId}`, {
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
      alert("Failed to update invoice status")
      // Ideal flow: reload from server if failed to rollback optimistic update
    }
  }

  // Filter out invoices based on search query
  const filteredInvoices = invoices.filter(inv => {
    const q = searchQuery.toLowerCase()
    const customer = inv.orders?.customers
    const fullName = `${customer?.first_name || ""} ${customer?.last_name || ""}`.toLowerCase()
    const invNumber = (inv.invoice_number || "").toLowerCase()
    const orderId = (inv.orders?.id || "").toLowerCase()
    return fullName.includes(q) || invNumber.includes(q) || orderId.includes(q)
  })

  // Sort descending by created_at of order, then paginate
  const sortedInvoices = filteredInvoices.sort((a, b) => new Date(b.orders?.created_at).getTime() - new Date(a.orders?.created_at).getTime())
  const totalPages = Math.max(1, Math.ceil(sortedInvoices.length / itemsPerPage))
  const currentInvoices = sortedInvoices.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  return (
    <div className="flex flex-col h-[calc(100vh-6rem)] p-2 md:p-6 gap-4">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shrink-0">
        <h1 className="text-2xl font-bold tracking-tight">Invoices</h1>

        <div className="relative w-full md:w-80">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search by invoice #, order ID or customer..."
            className="w-full pl-9 bg-white"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value)
              setCurrentPage(1) // reset to page 1 on search
            }}
          />
        </div>
      </div>

      <div className="rounded-md border bg-white flex-1 overflow-hidden flex flex-col">
        <Table containerClassName="flex-1 overflow-y-auto scrollbar-hidden h-full">
          <TableHeader className="sticky top-0 bg-muted/50 z-10 backdrop-blur-sm">
            <TableRow>
              <TableHead className="pl-4">Invoice #</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Order ID</TableHead>
              <TableHead>Subtotal</TableHead>
              <TableHead>Tax</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Status</TableHead>
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
                  <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                  <TableCell><Skeleton className="h-8 w-28" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                </TableRow>
              ))
            ) : sortedInvoices.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="h-32 text-center text-muted-foreground">
                  {searchQuery ? "No invoices match your search." : "No invoices found."}
                </TableCell>
              </TableRow>
            ) : (
              currentInvoices.map((inv: any) => (
                <TableRow key={inv.id} className="group transition-colors hover:bg-muted/30">
                  <TableCell className="font-medium pl-4">
                    <span className="truncate block text-sm font-mono" title={inv.invoice_number}>
                      {inv.invoice_number}
                    </span>
                  </TableCell>
                  <TableCell className="font-medium">
                    {inv.orders?.customers?.first_name} {inv.orders?.customers?.last_name}
                  </TableCell>
                  <TableCell>
                    <span className="truncate block text-[13px] max-w-[120px] font-mono text-muted-foreground group-hover:text-foreground transition-colors" title={inv.orders?.id}>
                      {inv.orders?.id?.split('-')[0]}
                    </span>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    ${Number(inv.subtotal).toFixed(2)}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    ${Number(inv.tax).toFixed(2)}
                  </TableCell>
                  <TableCell className="font-medium text-emerald-600 dark:text-emerald-400">
                    ${Number(inv.total).toFixed(2)}
                  </TableCell>
                  <TableCell>
                    <Select
                      value={inv.status}
                      onValueChange={(value) => handleStatusChange(inv.id, value)}
                    >
                      <SelectTrigger className="w-[120px] h-8 text-xs font-medium">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="DRAFT">Draft</SelectItem>
                        <SelectItem value="SENT">Sent</SelectItem>
                        <SelectItem value="PAID">Paid</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {new Date(inv.orders?.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Controls */}
      {!loading && sortedInvoices.length > 0 && (
        <div className="flex items-center justify-between shrink-0 bg-white p-3 rounded-md border">
          <div className="text-sm text-muted-foreground font-medium">
            Showing <span className="text-foreground">{(currentPage - 1) * itemsPerPage + 1}</span> to <span className="text-foreground">{Math.min(currentPage * itemsPerPage, sortedInvoices.length)}</span> of <span className="text-foreground">{sortedInvoices.length}</span> results
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
