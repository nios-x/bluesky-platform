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

export default function AdminsPage() {

  const [admins, setAdmins] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  useEffect(() => {
    async function loadAdmins() {
      try {
        const res = await fetch("/api/admin/admins")
        const data = await res.json()
        if (data.success) {
          setAdmins(data.admins || [])
        }
      } catch (error) {
        console.error("Failed to load admins", error)
      } finally {
        setLoading(false)
      }
    }

    loadAdmins()
  }, [])

  const handleUpdate = async (adminId: string, field: "admin_role" | "status", newValue: string) => {
    try {
      // Optimistically update the UI
      setAdmins((prevAdmins) =>
        prevAdmins.map((admin) =>
          admin.id === adminId
            ? { ...admin, [field]: newValue }
            : admin
        )
      )

      const payload = { [field]: newValue }

      const res = await fetch(`/api/admin/admins/${adminId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        throw new Error(`Failed to update ${field}`)
      }
    } catch (error) {
      console.error(`Update ${field} error:`, error)
      alert(`Failed to update admin ${field}`)
      // Reload from server if failed
    }
  }

  // Filter out admins based on search query
  const filteredAdmins = admins.filter(admin => {
    const q = searchQuery.toLowerCase()
    const name = (admin.name || "").toLowerCase()
    return name.includes(q)
  })

  const totalPages = Math.max(1, Math.ceil(filteredAdmins.length / itemsPerPage))
  const currentAdmins = filteredAdmins.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  return (
    <div className="flex flex-col h-[calc(100vh-6rem)] p-2 md:p-6 gap-4">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shrink-0">
        <h1 className="text-2xl font-bold tracking-tight">Admins Management</h1>

        <div className="relative w-full md:w-80">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search admins by name..."
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
              <TableHead className="pl-4">Name</TableHead>
              <TableHead>User ID</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created Date</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {loading ? (
              // Loading Skeleton State
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell className="pl-4"><Skeleton className="h-4 w-32" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-8 w-28" /></TableCell>
                  <TableCell><Skeleton className="h-8 w-28" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                </TableRow>
              ))
            ) : filteredAdmins.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-32 text-center text-muted-foreground">
                  {searchQuery ? "No admins match your search." : "No admins found."}
                </TableCell>
              </TableRow>
            ) : (
              currentAdmins.map((admin: any) => (
                <TableRow key={admin.id} className="group transition-colors hover:bg-muted/30">
                  <TableCell className="font-medium pl-4">
                    {admin.name}
                  </TableCell>
                  <TableCell>
                    <span className="truncate block text-[13px] max-w-[120px] font-mono text-muted-foreground group-hover:text-foreground transition-colors" title={admin.user_id}>
                      {admin.user_id?.split('-')[0]}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Select
                      value={admin.admin_role}
                      onValueChange={(value) => handleUpdate(admin.id, "admin_role", value)}
                    >
                      <SelectTrigger className="w-[120px] h-8 text-xs font-medium">
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="SUPER">Super Admin</SelectItem>
                        <SelectItem value="OPS">Operations</SelectItem>
                        <SelectItem value="SUPPORT">Support</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <Select
                      value={admin.status}
                      onValueChange={(value) => handleUpdate(admin.id, "status", value)}
                    >
                      <SelectTrigger className="w-[120px] h-8 text-xs font-medium">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ACTIVE">Active</SelectItem>
                        <SelectItem value="INACTIVE">Inactive</SelectItem>
                        <SelectItem value="SUSPENDED">Suspended</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {new Date(admin.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Controls */}
      {!loading && filteredAdmins.length > 0 && (
        <div className="flex items-center justify-between shrink-0 bg-white p-3 rounded-md border">
          <div className="text-sm text-muted-foreground font-medium">
            Showing <span className="text-foreground">{(currentPage - 1) * itemsPerPage + 1}</span> to <span className="text-foreground">{Math.min(currentPage * itemsPerPage, filteredAdmins.length)}</span> of <span className="text-foreground">{filteredAdmins.length}</span> results
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
