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
import { Search, Plus, Edit, Trash2 } from "lucide-react"
import { DumpsterFormSheet } from "@/components/admin/dumpster-form-sheet"

export default function AdminDumpstersPage() {
  const [dumpsters, setDumpsters] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  
  // Metadata for dropdowns
  const [types, setTypes] = useState<any[]>([])
  const [sizes, setSizes] = useState<any[]>([])

  // Sheet state
  const [sheetOpen, setSheetOpen] = useState(false)
  const [selectedDumpster, setSelectedDumpster] = useState<any | null>(null)

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const fetchData = async () => {
    try {
      setLoading(true)
      const [dumpstersRes, metaRes] = await Promise.all([
        fetch("/api/admin/dumpsters"),
        fetch("/api/admin/dumpsters/metadata")
      ])
      
      const dumpstersData = await dumpstersRes.json()
      const metaData = await metaRes.json()

      if (dumpstersData.success) setDumpsters(dumpstersData.dumpsters || [])
      if (metaData.success) {
        setTypes(metaData.types || [])
        setSizes(metaData.sizes || [])
      }
    } catch (error) {
      console.error("Failed to load data", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this dumpster? This action cannot be undone.")) return;
    
    try {
      const res = await fetch(`/api/admin/dumpsters/${id}`, { method: "DELETE" })
      const data = await res.json()
      if (!data.success) throw new Error(data.error)
      
      // Remove from state
      setDumpsters(prev => prev.filter(d => d.id !== id))
    } catch (error: any) {
      console.error("Delete error", error)
      alert(error.message || "Failed to delete dumpster. It might be referenced by existing orders.")
    }
  }

  const handleEdit = (dumpster: any) => {
    setSelectedDumpster(dumpster)
    setSheetOpen(true)
  }

  const handleCreate = () => {
    setSelectedDumpster(null)
    setSheetOpen(true)
  }

  // Filter out dumpsters based on search query
  const filteredDumpsters = dumpsters.filter(d => {
    const q = searchQuery.toLowerCase()
    return d.title?.toLowerCase().includes(q) || d.id.toLowerCase().includes(q)
  })

  const totalPages = Math.max(1, Math.ceil(filteredDumpsters.length / itemsPerPage))
  const currentDumpsters = filteredDumpsters.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  return (
    <div className="flex flex-col h-[calc(100vh-6rem)] p-2 md:p-6 gap-4">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shrink-0">
        <h1 className="text-2xl font-bold tracking-tight">Dumpsters Catalog</h1>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="relative w-full md:w-72">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search by title..."
              className="w-full pl-9 bg-white"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                setCurrentPage(1)
              }}
            />
          </div>
          <Button onClick={handleCreate} className="shrink-0 gap-1">
            <Plus className="h-4 w-4" /> Add Dumpster
          </Button>
        </div>
      </div>

      <div className="rounded-md border bg-white flex-1 overflow-hidden flex flex-col">
        <Table containerClassName="flex-1 overflow-y-auto scrollbar-hidden h-full">
          <TableHeader className="sticky top-0 bg-muted/50 z-10 backdrop-blur-sm">
            <TableRow>
              <TableHead className="pl-4">Title</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Size</TableHead>
              <TableHead>Allowed Items</TableHead>
              <TableHead className="text-right pr-4">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell className="pl-4"><Skeleton className="h-4 w-32" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-48" /></TableCell>
                  <TableCell><Skeleton className="h-8 w-16 ml-auto" /></TableCell>
                </TableRow>
              ))
            ) : currentDumpsters.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-32 text-center text-muted-foreground">
                  {searchQuery ? "No dumpsters match your search." : "No dumpsters found."}
                </TableCell>
              </TableRow>
            ) : (
              currentDumpsters.map((dumpster: any) => (
                <TableRow key={dumpster.id} className="group transition-colors hover:bg-muted/30">
                  <TableCell className="font-medium pl-4">
                    {dumpster.title}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {dumpster.dumpster_types?.name || "Unknown"}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {dumpster.dumpster_sizes?.label || "Unknown"}
                  </TableCell>
                  <TableCell className="text-sm">
                    <div className="truncate max-w-[250px]" title={dumpster.allowed_items?.join(", ")}>
                      {dumpster.allowed_items?.join(", ") || "None specified"}
                    </div>
                  </TableCell>
                  <TableCell className="text-right pr-4">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(dumpster)}>
                        <Edit className="h-4 w-4 text-muted-foreground" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(dumpster.id)}>
                        <Trash2 className="h-4 w-4 text-red-500 opacity-80 hover:opacity-100" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Controls */}
      {!loading && filteredDumpsters.length > 0 && (
        <div className="flex items-center justify-between shrink-0 bg-white p-3 rounded-md border">
          <div className="text-sm text-muted-foreground font-medium">
            Showing <span className="text-foreground">{(currentPage - 1) * itemsPerPage + 1}</span> to <span className="text-foreground">{Math.min(currentPage * itemsPerPage, filteredDumpsters.length)}</span> of <span className="text-foreground">{filteredDumpsters.length}</span> dumpsters
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

      {/* Slide-out Form */}
      <DumpsterFormSheet 
        open={sheetOpen} 
        onOpenChange={setSheetOpen} 
        dumpster={selectedDumpster} 
        types={types} 
        sizes={sizes}
        onSuccess={fetchData}
      />
    </div>
  )
}
