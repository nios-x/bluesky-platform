"use client"

import * as React from "react"
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type SortingState,
} from "@tanstack/react-table"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { EllipsisVerticalIcon, ArrowUpDown } from "lucide-react"

// Expected shape of the orders coming from API
type OrderData = {
  id: string
  total_amount: number
  order_status: string
  created_at: string
  customers: {
    first_name: string
    last_name: string
  }
}

export const columns: ColumnDef<OrderData>[] = [
  {
    accessorKey: "id",
    header: "Order ID",
    cell: ({ row }) => {
      const id = row.original.id
      return <div className="font-medium font-mono text-muted-foreground">{id.split('-')[0]}</div>
    },
  },
  {
    id: "customer",
    header: "Customer",
    cell: ({ row }) => {
      const { first_name, last_name } = row.original.customers || {}
      return <div>{first_name} {last_name}</div>
    },
  },
  {
    accessorKey: "order_status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.order_status
      let colorClass = "bg-slate-100 text-slate-800"
      if (status === 'COMPLETED') colorClass = "bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-400"
      if (status === 'IN_TRANSIT') colorClass = "bg-blue-100 text-blue-800 dark:bg-blue-500/20 dark:text-blue-400"
      if (status === 'CONFIRMED') colorClass = "bg-purple-100 text-purple-800 dark:bg-purple-500/20 dark:text-purple-400"
      if (status === 'CANCELLED') colorClass = "bg-red-100 text-red-800 dark:bg-red-500/20 dark:text-red-400"

      return (
        <Badge variant="outline" className={`px-2 font-medium ${colorClass} border-transparent`}>
          {status}
        </Badge>
      )
    },
  },
  {
    accessorKey: "total_amount",
    header: () => <div className="text-right">Amount</div>,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("total_amount"))
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount)

      return <div className="text-right font-medium text-emerald-600 dark:text-emerald-400">{formatted}</div>
    },
  },
  {
    accessorKey: "created_at",
    header: ({ column }) => {
      return (
        <div className="text-right flex justify-end">
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="h-8 data-[state=open]:bg-accent"
          >
            Date
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        </div>
      )
    },
    cell: ({ row }) => {
      return <div className="text-right pr-4">{new Date(row.original.created_at).toLocaleDateString()}</div>
    },
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="flex size-8 text-muted-foreground data-[state=open]:bg-muted"
            size="icon"
          >
            <EllipsisVerticalIcon className="size-4" />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-40">
          <DropdownMenuItem onClick={() => window.location.href = `/admin/orders`}>View Details</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="text-muted-foreground">Contact Customer</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
]

export function DataTable({ orders = [] }: { orders?: OrderData[] }) {
  const [sorting, setSorting] = React.useState<SortingState>([])

  const table = useReactTable({
    data: orders,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
  })

  return (
    <div className="flex flex-col gap-4 px-4 lg:px-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold tracking-tight">Recent Orders</h2>
        <Button variant="outline" size="sm" onClick={() => window.location.href = '/admin/orders'}>
          View all
        </Button>
      </div>

      <div className="overflow-hidden rounded-lg border bg-card text-card-foreground ">
        <Table>
          <TableHeader className="bg-muted/50">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="group hover:bg-muted/30"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="py-3">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-[300px] text-center"
                >
                  <div className="flex flex-col items-center justify-center space-y-3 h-full">
                    <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mb-1">
                      <svg className="h-6 w-6 text-muted-foreground opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                      </svg>
                    </div>
                    <h3 className="text-base font-medium text-slate-900 dark:text-slate-100">
                      No recent orders
                    </h3>
                    <p className="text-sm text-muted-foreground max-w-[250px] mx-auto">
                      New orders will appear here once customers book a dumpster.
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
