"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useBooking, BookingData } from "@/contexts/booking-context";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Trash2 } from "lucide-react";

type Props = {
  dumpsterTypes: { id: string; name: string; sizes?: number[] }[];
  sizes?: number[];
  onAddMore?: (data: { type: string; size: number; deliveryDate: string; removalDate: string; rentalPeriod: number }) => void;
  selectedIndex?: number;
  onSelect?: (index: number) => void;
};

export default function OrderDetailsCard({
  dumpsterTypes,
  sizes,
  onAddMore,
  selectedIndex = 0,
  onSelect,
}: Props) {
  const { bookings, removeBooking } = useBooking();
  const [type, setType] = useState("");
  const [size, setSize] = useState<number | "">("");
  const [deliveryDate, setDeliveryDate] = useState("");
  const [removalDate, setRemovalDate] = useState("");
  const [showDeliveryCalendar, setShowDeliveryCalendar] = useState(false);
  const [showRemovalCalendar, setShowRemovalCalendar] = useState(false);
  const [deliveryDateObj, setDeliveryDateObj] = useState<Date | undefined>(undefined);
  const [removalDateObj, setRemovalDateObj] = useState<Date | undefined>(undefined);

  const handleAddMore = () => {
    if (!type || !size || !deliveryDate) {
      alert("Please select a dumpster type, size, and delivery date.");
      return;
    }

    let rentalPeriod = 7;
    if (removalDate && deliveryDate) {
      const start = new Date(deliveryDate);
      const end = new Date(removalDate);
      const diffTime = Math.abs(end.getTime() - start.getTime());
      rentalPeriod = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }

    if (onAddMore) {
      onAddMore({ type, size: Number(size), deliveryDate, removalDate, rentalPeriod });
    }

    setType("");
    setSize("");
    setDeliveryDate("");
    setRemovalDate("");
    setDeliveryDateObj(undefined);
    setRemovalDateObj(undefined);
  };

  return (
    <div className=" rounded-xl p-6 bg-white shadow-sm">
      {/* Title */}
      <h2 className="text-xl font-bold text-[#142A52] mb-6">
        Selected Items
      </h2>
      {/* Price Breakdown */}
      <div className="border-2 border-dashed border-[#142A52]/30 rounded-lg p-5 bg-[#f9fafb]">
        <h3 className="font-bold text-[#142A52] mb-3">
          Price Breakdown
        </h3>

        <div className="text-sm text-[#142A52]/70">
          {bookings && bookings.length > 0 ? (
            <div className="space-y-4">
              {bookings.map((b: BookingData, idx: number) => (
                <div 
                  key={idx} 
                  onClick={() => onSelect && onSelect(idx)}
                  className={`flex justify-between items-center p-2 rounded cursor-pointer transition-colors border-[#142A52]/10 last:border-0 last:pb-0 ${selectedIndex === idx ? 'bg-[#142A52]/10 border-l-4 border-l-[#C89B2B]' : 'hover:bg-gray-100'}`}
                >
                  <div>
                    <p className="font-bold text-[#142A52]">
                      {b.dumpsterSize ? `${b.dumpsterSize} Yard ` : ''}
                      {dumpsterTypes.find(t => t.id === b.dumpsterType)?.name || b.dumpsterType || 'Dumpster'}
                    </p>
                    {b.rentalPeriod ? <p className="text-xs text-[#142A52]/70">{b.rentalPeriod} Days</p> : null}
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="font-bold text-[#142A52]">${b.totalPrice ? b.totalPrice.toFixed(2) : "0.00"}</p>
                    </div>
                    {bookings.length > 1 && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeBooking(idx);
                          if (selectedIndex === idx && onSelect) {
                            onSelect(0);
                          } else if (selectedIndex > idx && onSelect) {
                            onSelect(selectedIndex - 1);
                          }
                        }}
                        className="flex items-center gap-1 text-red-500 hover:text-red-700 transition-colors p-1 rounded hover:bg-red-50"
                        title="Remove Item"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
              <div className="flex justify-between items-center pt-2 border-t border-[#142A52]/30 mt-2">
                <span className="font-bold text-[#142A52]">Total</span>
                <span className="font-bold text-[#C89B2B]">
                  ${bookings.reduce((sum: number, b: BookingData) => sum + (b.totalPrice || 0), 0).toFixed(2)}
                </span>
              </div>
            </div>
          ) : (
            <p>No items added yet.</p>
          )}
        </div>
      </div>
      {/* Type */}
      <div className="mb-5 mt-3">
        <label className="block text-sm font-bold text-[#142A52] mb-2">
          Type of Dumpster
        </label>
        <Select value={type} onValueChange={(t) => { setType(t); setSize(""); }}>
          <SelectTrigger className="w-full border-2 border-[#142A52]/30 rounded-lg h-[52px] focus:border-[#C89B2B] focus:ring-[#C89B2B]/20 text-black">
            <SelectValue placeholder="Select type" />
          </SelectTrigger>
          <SelectContent>
            {dumpsterTypes.map((t) => (
              <SelectItem key={t.id} value={t.id}>
                {t.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Size */}
      <div className="mb-5">
        <label className="block text-sm font-bold text-[#142A52] mb-2">
          Size of Dumpster
        </label>
        <Select value={size?.toString() || ""} onValueChange={(val) => setSize(Number(val))} disabled={!type}>
          <SelectTrigger className="w-full border-2 border-[#142A52]/30 rounded-lg h-[52px] focus:border-[#C89B2B] focus:ring-[#C89B2B]/20 text-black disabled:opacity-50">
            <SelectValue placeholder={type ? "Select size" : "Select type first"} />
          </SelectTrigger>
          <SelectContent>
            {(dumpsterTypes.find(t => t.id === type)?.sizes || sizes || []).map((s) => (
              <SelectItem key={s} value={s.toString()}>
                {s} Yard
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Dates */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm font-bold text-[#142A52] mb-2">
            Delivery Date
          </label>
          <Popover open={showDeliveryCalendar} onOpenChange={setShowDeliveryCalendar}>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full justify-start text-left font-normal border-2 border-[#142A52]/30 rounded-lg h-[52px] px-4 focus:ring-[#C89B2B]/20 focus:border-[#C89B2B] text-black">
                {deliveryDate ? new Date(deliveryDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "Select date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={deliveryDateObj}
                onSelect={(selectedDate) => {
                  if (selectedDate) {
                    setDeliveryDateObj(selectedDate);
                    setDeliveryDate(selectedDate.toISOString().split("T")[0]);
                    setShowDeliveryCalendar(false);
                    
                    const defaultRemoval = new Date(selectedDate);
                    defaultRemoval.setDate(defaultRemoval.getDate() + 7);
                    if (defaultRemoval.getDay() === 0) defaultRemoval.setDate(defaultRemoval.getDate() + 1);
                    else if (defaultRemoval.getDay() === 6) defaultRemoval.setDate(defaultRemoval.getDate() + 2);
                    
                    setRemovalDateObj(defaultRemoval);
                    setRemovalDate(defaultRemoval.toISOString().split("T")[0]);
                  }
                }}
                disabled={(date) => {
                  const today = new Date();
                  today.setHours(0, 0, 0, 0);
                  if (date < today) return true;
                  const dayOfWeek = date.getDay();
                  return dayOfWeek === 0 || dayOfWeek === 6;
                }}
              />
            </PopoverContent>
          </Popover>
        </div>

        <div>
          <label className="block text-sm font-bold text-[#142A52] mb-2">
            Removal Date
          </label>
          <Popover open={showRemovalCalendar} onOpenChange={setShowRemovalCalendar}>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full justify-start text-left font-normal border-2 border-[#142A52]/30 rounded-lg h-[52px] px-4 focus:ring-[#C89B2B]/20 focus:border-[#C89B2B] text-black">
                {removalDate ? new Date(removalDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "Select date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={removalDateObj}
                onSelect={(selectedDate) => {
                  if (selectedDate) {
                    setRemovalDateObj(selectedDate);
                    setRemovalDate(selectedDate.toISOString().split("T")[0]);
                    setShowRemovalCalendar(false);
                  }
                }}
                disabled={(date) => {
                  const dayOfWeek = date.getDay();
                  if (dayOfWeek === 0 || dayOfWeek === 6) return true;
                  if (deliveryDate && date < new Date(deliveryDate)) return true;
                  return false;
                }}
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>
      
      <Button
        onClick={handleAddMore}
        className="w-full mb-6 bg-[#142A52] hover:bg-[#0f1f3a] text-white font-bold py-3 rounded-lg"
      >
        + Add More Dumpsters
      </Button>

      
    </div>
  );
}