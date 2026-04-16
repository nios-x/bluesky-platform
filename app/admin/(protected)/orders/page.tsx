"use client"

import { useEffect, useState } from "react"

export default function AdminOrdersPage() {

  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

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
      setLoading(true)

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

      // Update UI instantly
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId
            ? { ...order, order_status: newStatus }
            : order
        )
      )

    } catch (error) {
      console.error("Status update error:", error)
      alert("Failed to update order status")
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="p-6">Loading orders...</div>
  }

  return (
    <div className="p-6">

      <h1 className="text-2xl font-bold mb-6">Orders</h1>

      <table className="w-full border">

        <thead>
          <tr className="bg-gray-100">
            <th className="p-3 border">Order ID</th>
            <th className="p-3 border">Customer</th>
            <th className="p-3 border">Status</th>
            <th className="p-3 border">Amount</th>
            <th className="p-3 border">Created</th>
          </tr>
        </thead>

        <tbody>

          {orders.length === 0 && (
            <tr>
              <td colSpan={5} className="text-center p-6">
                No orders found
              </td>
            </tr>
          )}

          {orders.map((order: any) => (
            <tr key={order.id}>

              <td className="p-3 border">{order.id}</td>

              <td className="p-3 border">
                {order.customers?.first_name} {order.customers?.last_name}
              </td>

              <td className="p-3 border">
                <select
                  value={order.order_status}
                  onChange={(e) =>
                    handleStatusChange(order.id, e.target.value)
                  }
                  className="border px-2 py-1 rounded"
                >
                  <option value="CONFIRMED">Confirmed</option>
                  <option value="IN_TRANSIT">In Transit</option>
                  <option value="DELIVERED">Delivered</option>
                  <option value="COMPLETED">Completed</option>
                  <option value="CANCELLED">Cancelled</option>
                </select>
              </td>

              <td className="p-3 border">${order.total_amount}</td>

              <td className="p-3 border">
                {new Date(order.created_at).toLocaleDateString()}
              </td>

            </tr>
          ))}

        </tbody>

      </table>

    </div>
  )
}