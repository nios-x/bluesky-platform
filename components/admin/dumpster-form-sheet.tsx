"use client"

import { useState, useEffect } from "react"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Loader2 } from "lucide-react"

type DumpsterFormSheetProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  dumpster?: any | null
  types: any[]
  sizes: any[]
  onSuccess: () => void
}

export function DumpsterFormSheet({
  open,
  onOpenChange,
  dumpster,
  types,
  sizes,
  onSuccess,
}: DumpsterFormSheetProps) {
  const [loading, setLoading] = useState(false)

  const [formData, setFormData] = useState({
    title: "",
    dumpster_type_id: "",
    dumpster_size_id: "",
    allowed_items: "",
    not_allowed_items: "",
    images: "",
  })

  useEffect(() => {
    if (dumpster) {
      setFormData({
        title: dumpster.title || "",
        dumpster_type_id: dumpster.dumpster_type_id || "",
        dumpster_size_id: dumpster.dumpster_size_id || "",
        allowed_items: (dumpster.allowed_items || []).join(", "),
        not_allowed_items: (dumpster.not_allowed_items || []).join(", "),
        images: (dumpster.images || []).join(", "),
      })
    } else {
      setFormData({
        title: "",
        dumpster_type_id: "",
        dumpster_size_id: "",
        allowed_items: "",
        not_allowed_items: "",
        images: "",
      })
    }
  }, [dumpster, open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Convert comma separated strings back to arrays
    const payload = {
      title: formData.title,
      dumpster_type_id: formData.dumpster_type_id,
      dumpster_size_id: formData.dumpster_size_id,
      allowed_items: formData.allowed_items ? formData.allowed_items.split(",").map(i => i.trim()).filter(Boolean) : [],
      not_allowed_items: formData.not_allowed_items ? formData.not_allowed_items.split(",").map(i => i.trim()).filter(Boolean) : [],
      images: formData.images ? formData.images.split(",").map(i => i.trim()).filter(Boolean) : [],
    }

    try {
      const url = dumpster ? `/api/admin/dumpsters/${dumpster.id}` : `/api/admin/dumpsters`
      const method = dumpster ? "PUT" : "POST"

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.error || "Failed to save dumpster")
      }

      onSuccess()
      onOpenChange(false)
    } catch (err: any) {
      console.error(err)
      alert(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-[400px] sm:w-[540px] overflow-y-auto p-2">
        <SheetHeader>
          <SheetTitle>{dumpster ? "Edit Dumpster" : "Add New Dumpster"}</SheetTitle>
          <SheetDescription>
            Fill out the details below. Click save when you're done.
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6 p-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="title">Title <span className="text-red-500">*</span></Label>
            <Input
              id="title"
              required
              placeholder="e.g. 10 Yard Roll Off"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="type">Dumpster Type <span className="text-red-500">*</span></Label>
            <Select
              required
              value={formData.dumpster_type_id}
              onValueChange={(val) => setFormData({ ...formData, dumpster_type_id: val })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                {types.map((t) => (
                  <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="size">Dumpster Size <span className="text-red-500">*</span></Label>
            <Select
              required
              value={formData.dumpster_size_id}
              onValueChange={(val) => setFormData({ ...formData, dumpster_size_id: val })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select size" />
              </SelectTrigger>
              <SelectContent>
                {sizes.map((s) => (
                  <SelectItem key={s.id} value={s.id}>{s.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="allowed">Allowed Items (comma separated)</Label>
            <Input
              id="allowed"
              placeholder="Wood, drywall, cardboard..."
              value={formData.allowed_items}
              onChange={(e) => setFormData({ ...formData, allowed_items: e.target.value })}
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="not_allowed">Not Allowed Items (comma separated)</Label>
            <Input
              id="not_allowed"
              placeholder="Hazardous waste, tires, batteries..."
              value={formData.not_allowed_items}
              onChange={(e) => setFormData({ ...formData, not_allowed_items: e.target.value })}
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="images">Images (comma separated URLs)</Label>
            <Input
              id="images"
              placeholder="https://example.com/img1.jpg, https://..."
              value={formData.images}
              onChange={(e) => setFormData({ ...formData, images: e.target.value })}
            />
          </div>

          <Button type="submit" disabled={loading} className="mt-4">
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {dumpster ? "Update Dumpster" : "Create Dumpster"}
          </Button>
        </form>
      </SheetContent>
    </Sheet>
  )
}
