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
import { Search, User, Mail, Phone, ExternalLink } from "lucide-react"
import Link from "next/link"

export default function CustomersListPage() {
  const [customers, setCustomers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  useEffect(() => {
    async function loadCustomers() {
      try {
        const res = await fetch("/api/admin/customers")
        const data = await res.json()
        setCustomers(data.customers || [])
      } catch (error) {
        console.error("Failed to load customers", error)
      } finally {
        setLoading(false)
      }
    }
    loadCustomers()
  }, [])

  const filteredCustomers = customers.filter(customer => {
    const q = searchQuery.toLowerCase()
    const fullName = `${customer.first_name || ""} ${customer.last_name || ""}`.toLowerCase()
    const email = (customer.billing_addresses?.[0]?.email || "").toLowerCase()
    const phone = (customer.phone || "").toLowerCase()
    return fullName.includes(q) || email.includes(q) || phone.includes(q)
  })

  const totalPages = Math.max(1, Math.ceil(filteredCustomers.length / itemsPerPage))
  const currentCustomers = filteredCustomers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  return (
    <div className="flex flex-col h-[calc(100vh-6rem)] p-2 md:p-6 gap-4">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shrink-0">
        <h1 className="text-2xl font-bold tracking-tight">Customers Management</h1>

        <div className="relative w-full md:w-72">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search by name, email, or phone..."
            className="w-full pl-9 bg-white"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value)
              setCurrentPage(1)
            }}
          />
        </div>
      </div>

      <div className="rounded-md border bg-white flex-1 overflow-hidden flex flex-col">
        <Table containerClassName="flex-1 overflow-y-auto scrollbar-hidden h-full">
          <TableHeader className="sticky top-0 bg-muted/50 z-10 backdrop-blur-sm">
            <TableRow>
              <TableHead className="pl-4">Customer Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Joined Date</TableHead>
              <TableHead className="text-right pr-4">Action</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell className="pl-4"><Skeleton className="h-4 w-32" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-40" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                  <TableCell className="text-right pr-4"><Skeleton className="h-8 w-20 ml-auto" /></TableCell>
                </TableRow>
              ))
            ) : currentCustomers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-[400px] text-center">
                  <div className="flex flex-col items-center justify-center space-y-3 h-full">
                    <User className="h-12 w-12 text-muted-foreground opacity-20" />
                    <h3 className="text-lg font-semibold">No customers found</h3>
                    <p className="text-sm text-muted-foreground">Try adjusting your search query.</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              currentCustomers.map((customer: any) => (
                <TableRow key={customer.id} className="group hover:bg-muted/30">
                  <TableCell className="font-medium pl-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                        {customer.first_name?.[0]}{customer.last_name?.[0]}
                      </div>
                      <span>{customer.first_name} {customer.last_name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground italic text-sm">
                    Click "View Details" to see email
                  </TableCell>
                  <TableCell>{customer.phone}</TableCell>
                  <TableCell>
                    <span className="capitalize text-xs font-medium px-2 py-1 rounded bg-blue-50 text-blue-600 border border-blue-100">
                      {customer.customer_type?.toLowerCase()}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className={`text-xs font-medium px-2 py-1 rounded border ${
                      customer.status === 'ACTIVE' 
                      ? 'bg-green-50 text-green-600 border-green-100' 
                      : 'bg-gray-50 text-gray-600 border-gray-100'
                    }`}>
                      {customer.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {new Date(customer.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right pr-4">
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/admin/customers/${customer.id}`} className="flex items-center gap-1">
                        View Details <ExternalLink className="h-3 w-3" />
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {!loading && filteredCustomers.length > itemsPerPage && (
        <div className="flex items-center justify-between shrink-0 bg-white p-3 rounded-md border">
          <div className="text-sm text-muted-foreground font-medium">
            Showing {currentCustomers.length} of {filteredCustomers.length}
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
