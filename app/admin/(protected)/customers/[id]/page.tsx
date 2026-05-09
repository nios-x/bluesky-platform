"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  CreditCard, 
  Package, 
  Calendar, 
  ChevronLeft,
  Building,
  Info,
  Clock,
  ExternalLink
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

export default function CustomerDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    async function loadCustomer() {
      try {
        const res = await fetch(`/api/admin/customers/${params.id}`)
        const json = await res.json()
        if (json.success) {
          setData(json)
        } else {
          setError(json.error || "Failed to load customer")
        }
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    if (params.id) loadCustomer()
  }, [params.id])

  if (loading) {
    return (
      <div className="p-8 space-y-6">
        <Skeleton className="h-8 w-64" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Skeleton className="h-[400px] col-span-1" />
          <Skeleton className="h-[400px] col-span-2" />
        </div>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-xl font-bold text-red-600">Error</h2>
        <p className="text-gray-600">{error || "Customer not found"}</p>
        <Button onClick={() => router.back()} className="mt-4">Go Back</Button>
      </div>
    )
  }

  const { customer, orders } = data

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3 md:gap-4">
          <Button variant="outline" size="icon" onClick={() => router.back()} className="shrink-0">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="min-w-0">
            <h1 className="text-xl md:text-3xl font-bold tracking-tight text-[#142A52] truncate">Customer Profile</h1>
            <p className="text-[10px] md:text-sm text-muted-foreground mt-1 truncate">ID: {customer.id}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 self-start sm:self-center">
          <Badge className={customer.status === 'ACTIVE' ? 'bg-green-100 text-green-700 border-green-200' : 'bg-gray-100 text-gray-700'}>
            {customer.status}
          </Badge>
          <Badge variant="outline" className="capitalize">
            {customer.customer_type?.toLowerCase()}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Contact Info */}
        <div className="space-y-6">
          <Card className="overflow-hidden border-2 border-[#142A52]/10 shadow-sm">
            <CardHeader className="bg-[#142A52]/5 border-b border-[#142A52]/10">
              <CardTitle className="text-lg flex items-center gap-2 text-[#142A52]">
                <User className="h-5 w-5 text-[#C89B2B]" />
                Personal Details
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div className="flex items-start gap-3">
                <Info className="h-4 w-4 text-muted-foreground mt-1" />
                <div>
                  <p className="text-[11px] font-bold uppercase text-muted-foreground">Full Name</p>
                  <p className="font-semibold text-lg">{customer.first_name} {customer.last_name}</p>
                </div>
              </div>

              {customer.company_name && (
                <div className="flex items-start gap-3">
                  <Building className="h-4 w-4 text-muted-foreground mt-1" />
                  <div>
                    <p className="text-[11px] font-bold uppercase text-muted-foreground">Company</p>
                    <p className="font-medium">{customer.company_name}</p>
                  </div>
                </div>
              )}

              <div className="flex items-start gap-3">
                <Mail className="h-4 w-4 text-muted-foreground mt-1" />
                <div>
                  <p className="text-[11px] font-bold uppercase text-muted-foreground">Email</p>
                  <a href={`mailto:${customer.billing_addresses?.[0]?.email}`} className="text-primary hover:underline">
                    {customer.billing_addresses?.[0]?.email || "N/A"}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="h-4 w-4 text-muted-foreground mt-1" />
                <div>
                  <p className="text-[11px] font-bold uppercase text-muted-foreground">Phone</p>
                  <p className="font-medium">{customer.phone}</p>
                </div>
              </div>

              <div className="flex items-start gap-3 border-t pt-4 mt-4">
                <Clock className="h-4 w-4 text-muted-foreground mt-1" />
                <div>
                  <p className="text-[11px] font-bold uppercase text-muted-foreground">Joined</p>
                  <p className="text-sm">{new Date(customer.created_at).toLocaleDateString(undefined, { dateStyle: 'long' })}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Addresses Card */}
          <Card className="overflow-hidden border-2 border-[#142A52]/10 shadow-sm">
            <CardHeader className="bg-[#142A52]/5 border-b border-[#142A52]/10">
              <CardTitle className="text-lg flex items-center gap-2 text-[#142A52]">
                <MapPin className="h-5 w-5 text-[#C89B2B]" />
                Addresses
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              {/* Shipping Addresses */}
              <div>
                <h4 className="text-[11px] font-bold uppercase text-[#142A52]/60 mb-3 tracking-wider">Service Locations (Shipping)</h4>
                <div className="space-y-3">
                  {customer.customer_addresses?.map((addr: any) => (
                    <div key={addr.id} className="p-3 rounded-lg bg-gray-50 border border-gray-200">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] font-bold text-gray-400">ADDRESS ID: {addr.id.split('-')[0]}</span>
                        {addr.is_default && <Badge variant="secondary" className="text-[10px] h-4">DEFAULT</Badge>}
                      </div>
                      <p className="text-sm font-medium">{addr.address_line1}</p>
                      <p className="text-sm text-muted-foreground">{addr.city}, {addr.state} {addr.zip}</p>
                    </div>
                  ))}
                  {(!customer.customer_addresses || customer.customer_addresses.length === 0) && (
                    <p className="text-sm text-muted-foreground italic">No service addresses found</p>
                  )}
                </div>
              </div>

              {/* Billing Addresses */}
              <div className="border-t pt-6">
                <h4 className="text-[11px] font-bold uppercase text-[#142A52]/60 mb-3 tracking-wider">Billing Profiles</h4>
                <div className="space-y-3">
                  {customer.billing_addresses?.map((addr: any) => (
                    <div key={addr.id} className="p-3 rounded-lg bg-[#C89B2B]/5 border border-[#C89B2B]/20">
                      <div className="flex items-center justify-between mb-1">
                         <span className="text-[10px] font-bold text-[#C89B2B]">BILLING ID: {addr.id.split('-')[0]}</span>
                         <CreditCard className="h-3 w-3 text-[#C89B2B]" />
                      </div>
                      <p className="text-sm font-bold">{addr.full_name}</p>
                      <p className="text-xs text-muted-foreground mb-2">{addr.email} | {addr.phone}</p>
                      <p className="text-sm">{addr.address}</p>
                      <p className="text-sm text-muted-foreground">{addr.city}, {addr.state} {addr.zip}</p>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Order History */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-2 border-[#142A52]/10 shadow-sm min-h-[600px]">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-7 border-b border-[#142A52]/10 bg-[#142A52]/5">
              <div className="space-y-1">
                <CardTitle className="text-2xl font-bold text-[#142A52] flex items-center gap-2">
                  <Package className="h-6 w-6 text-[#C89B2B]" />
                  Order History
                </CardTitle>
                <CardDescription>
                  Found {orders.length} orders for this customer
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                {orders.map((order: any) => (
                  <div 
                    key={order.id} 
                    className="p-3 md:p-4 border rounded-xl hover:border-[#142A52] hover:bg-gray-50 transition-all group"
                  >
                    <div className="flex flex-col gap-4">
                      <div className="space-y-2">
                        <div className="flex flex-wrap items-center gap-2 md:gap-3">
                          <span className="font-mono text-xs md:text-sm font-bold text-muted-foreground">#{order.id.split('-')[0]}</span>
                          <Badge variant="outline" className="h-5 text-[9px] md:text-[10px] font-bold">
                            {order.order_status}
                          </Badge>
                          <span className="text-[11px] md:text-sm text-muted-foreground flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {new Date(order.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        
                        {/* Services List */}
                        <div className="flex flex-wrap gap-2 mt-2">
                          {order.order_services?.map((svc: any, idx: number) => (
                            <div key={idx} className="bg-white border px-3 py-1.5 rounded-lg flex items-center gap-2 shadow-sm">
                              <span className="text-xs font-bold text-[#142A52]">{svc.dumpster_size} yd</span>
                              <div className="h-3 w-px bg-gray-200" />
                              <span className="text-xs text-gray-600 capitalize">{svc.dumpster_type?.replace(/_/g, ' ')}</span>
                            </div>
                          ))}
                        </div>

                        {order.placement_instructions && (
                          <p className="text-xs text-muted-foreground bg-yellow-50 p-2 rounded border border-yellow-100 mt-2">
                            <strong>Note:</strong> {order.placement_instructions}
                          </p>
                        )}
                      </div>

                      <div className="flex items-center justify-between mt-2 pt-2 border-t md:border-t-0 md:pt-0 md:mt-0">
                        <p className="text-lg md:text-xl font-bold text-emerald-600">${Number(order.total_amount).toFixed(2)}</p>
                        <Link 
                          href={`/admin/orders`}
                          className="text-xs text-primary font-bold flex items-center gap-1 md:opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          Details <ExternalLink className="h-3 w-3" />
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}

                {orders.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
                    <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center">
                      <Package className="h-8 w-8 text-muted-foreground opacity-20" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-500">No orders found</p>
                      <p className="text-sm text-muted-foreground">This customer hasn't placed any orders yet.</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
