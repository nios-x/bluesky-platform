"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useBooking, BookingData } from "@/contexts/booking-context";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Trash2, Zap } from "lucide-react";
import { ACCOUNT_DISCOUNT } from "@/lib/constants/booking";

type Props = {
    dumpsterTypes: { id: string; name: string; sizes?: number[] }[];
    sizes?: number[];
    onAddMore?: (data: { type: string; size: number; deliveryDate: string; removalDate: string; rentalPeriod: number }) => void;
    selectedIndex?: number;
    onSelect?: (index: number) => void;
    cartTotal?: number;
    itemPrices?: number[];
    cartBreakdown?: { basePrice: number; surcharges: number; extraDays: number; shipping: number };
    accountCreation?: boolean;
};

export default function OrderDetailsCard({
    dumpsterTypes,
    sizes,
    onAddMore,
    selectedIndex = 0,
    onSelect,
    cartTotal,
    itemPrices,
    cartBreakdown,
    accountCreation,
}: Props) {
    const { bookings, removeBooking, updateBooking } = useBooking();
    const [type, setType] = useState("");
    const [size, setSize] = useState<number | "">("");
    const [deliveryDate, setDeliveryDate] = useState("");
    const [removalDate, setRemovalDate] = useState("");
    const [showDeliveryCalendar, setShowDeliveryCalendar] = useState(false);
    const [showRemovalCalendar, setShowRemovalCalendar] = useState(false);
    const [isAddingNew, setIsAddingNew] = useState(false);
    const [deliveryDateObj, setDeliveryDateObj] = useState<Date | undefined>(undefined);
    const [removalDateObj, setRemovalDateObj] = useState<Date | undefined>(undefined);

    const handleAddMore = () => {
        if (type && size && deliveryDate && removalDate && onAddMore) {
            const delivery = new Date(deliveryDate);
            const removal = new Date(removalDate);
            const diffTime = Math.abs(removal.getTime() - delivery.getTime());
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            onAddMore({
                type,
                size: Number(size),
                deliveryDate,
                removalDate,
                rentalPeriod: diffDays
            });

            setType("");
            setSize("");
            setDeliveryDate("");
            setRemovalDate("");
            setDeliveryDateObj(undefined);
            setRemovalDateObj(undefined);
            setIsAddingNew(false);
        }
    };

    return (
        <div className="w-full">
            <h2 className="text-xl font-bold text-[#142A52] mb-6 flex items-center gap-2">
                Selected Items
            </h2>
            {/* Price Breakdown */}
            {bookings && bookings.length > 1 && (
                <div className="border-2 border-dashed border-[#142A52]/30 rounded-lg p-5 bg-[#f9fafb] mb-4">
                    <h3 className="font-bold text-[#142A52] mb-3">
                        Price Breakdown
                    </h3>
                    <div className="text-sm text-[#142A52]/70">
                        <div className="space-y-4">
                            {bookings.map((b: BookingData, idx: number) => (
                                <div
                                    key={idx}
                                    onClick={() => onSelect && onSelect(idx)}
                                    className={`flex flex-col p-3 rounded cursor-pointer transition-colors border-[#142A52]/10 border ${selectedIndex === idx ? 'bg-[#142A52]/5 border-l-4 border-l-[#C89B2B]' : 'hover:bg-gray-50'}`}
                                >
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className="font-bold text-[#142A52]">
                                                {b.dumpsterSize ? `${b.dumpsterSize} Yard ` : ''}
                                                {dumpsterTypes.find(t => t.id === b.dumpsterType)?.name || b.dumpsterType || 'Dumpster'}
                                            </p>
                                            {b.rentalPeriod ? <p className="text-xs text-[#142A52]/70">{b.rentalPeriod} Days</p> : null}
                                        </div>
                                        <div className="flex flex-col items-end gap-2">
                                            <p className="font-bold text-[#142A52]">${itemPrices && itemPrices[idx] !== undefined ? itemPrices[idx].toFixed(2) : (b.totalPrice ? b.totalPrice.toFixed(2) : "0.00")}</p>
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

                                    {/* Inline Edit Controls for Selected Item */}
                                    {selectedIndex === idx && (
                                        <div className="grid grid-cols-2 gap-3 mt-3 pt-3 border-t border-[#142A52]/10" onClick={(e) => e.stopPropagation()}>
                                            <div>
                                                <label className="block text-xs font-bold text-[#142A52] mb-1.5">Change Type</label>
                                                <Select
                                                    value={b.dumpsterType}
                                                    onValueChange={(val) => {
                                                        updateBooking(idx, { dumpsterType: val, dumpsterSize: 0 });
                                                    }}
                                                >
                                                    <SelectTrigger className="h-8 text-xs bg-white border border-[#142A52]/30 text-[#142A52] font-medium focus:ring-0 focus:border-[#C89B2B]">
                                                        <SelectValue placeholder="Type" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {dumpsterTypes.map((t) => (
                                                            <SelectItem key={t.id} value={t.id} className="text-sm">
                                                                {t.name}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-[#142A52] mb-1.5">Change Size</label>
                                                <Select
                                                    value={b.dumpsterSize ? b.dumpsterSize.toString() : ""}
                                                    onValueChange={(val) => {
                                                        updateBooking(idx, { dumpsterSize: parseInt(val) });
                                                    }}
                                                >
                                                    <SelectTrigger className="h-8 text-xs bg-white border border-[#142A52]/30 text-[#142A52] font-medium focus:ring-0 focus:border-[#C89B2B]">
                                                        <SelectValue placeholder="Size" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {(dumpsterTypes.find(t => t.id === b.dumpsterType)?.sizes || sizes || []).map((s) => (
                                                            <SelectItem key={s} value={s.toString()} className="text-sm">
                                                                {s} Yard
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                            <div className="flex justify-between items-center pt-2 border-t border-[#142A52]/30 mt-2">
                                <span className="font-bold text-[#142A52]">Total</span>
                                <span className="font-bold text-[#C89B2B]">
                                    ${(cartTotal ?? bookings.reduce((sum: number, b: BookingData) => sum + (b.totalPrice || 0), 0)).toFixed(2)}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* When there is only 1 item, still show it without the "Price Breakdown" container */}
            {bookings && bookings.length === 1 && (
                <div className="mb-6">
                    {bookings.map((b: BookingData, idx: number) => (
                        <div
                            key={idx}
                            onClick={() => onSelect && onSelect(idx)}
                            className="flex flex-col p-4 rounded-lg bg-zinc-50 border border-[#142A52]/20"
                        >
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="font-bold text-lg text-[#142A52]">
                                        {b.dumpsterSize ? `${b.dumpsterSize} Yard ` : ''}
                                        {dumpsterTypes.find(t => t.id === b.dumpsterType)?.name || b.dumpsterType || 'Dumpster'}
                                    </p>
                                    {b.rentalPeriod ? <p className="text-sm text-[#142A52]/70">{b.rentalPeriod} Days Rental</p> : null}
                                </div>
                            </div>

                            {/* Inline Edit Controls for Single Item */}
                            <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-[#142A52]/10">
                                <div>
                                    <label className="block text-xs font-bold text-[#142A52] mb-2">Change Type</label>
                                    <Select
                                        value={b.dumpsterType}
                                        onValueChange={(val) => {
                                            updateBooking(idx, { dumpsterType: val, dumpsterSize: 0 });
                                        }}
                                    >
                                        <SelectTrigger className="h-8 text-xs bg-white border-2 border-[#142A52]/30 text-[#142A52] font-medium focus:ring-[#C89B2B]/20 focus:border-[#C89B2B]">
                                            <SelectValue placeholder="Type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {dumpsterTypes.map((t) => (
                                                <SelectItem key={t.id} value={t.id} className="text-sm">
                                                    {t.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-[#142A52] mb-2">Change Size</label>
                                    <Select
                                        value={b.dumpsterSize ? b.dumpsterSize.toString() : ""}
                                        onValueChange={(val) => {
                                            updateBooking(idx, { dumpsterSize: parseInt(val) });
                                        }}
                                    >
                                        <SelectTrigger className="h-8 text-xs bg-white border-2 border-[#142A52]/30 text-[#142A52] font-medium focus:ring-[#C89B2B]/20 focus:border-[#C89B2B]">
                                            <SelectValue placeholder="Size" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {(dumpsterTypes.find(t => t.id === b.dumpsterType)?.sizes || sizes || []).map((s) => (
                                                <SelectItem key={s} value={s.toString()} className="text-sm">
                                                    {s} Yard
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Add New Item Section */}
            {!isAddingNew ? (
                <Button
                    onClick={() => setIsAddingNew(true)}
                    variant="outline"
                    className="w-full border-2 border-dashed border-[#142A52]/40 text-[#142A52] hover:bg-[#142A52]/5 hover:border-[#142A52]/60 font-bold py-6 rounded-lg mb-2"
                >
                    + Add a Dumpster
                </Button>
            ) : (
                <div className="mt-6 border border-[#142A52]/20 rounded-lg p-5 bg-[#fcfcfc]">
                    <h3 className="font-bold text-[#142A52] mb-4 text-lg">Add New Dumpster</h3>
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

                    <div className="flex gap-3">
                        <Button
                            onClick={() => setIsAddingNew(false)}
                            variant="outline"
                            className="flex-1 bg-white text-[#142A52] font-bold py-3 rounded-lg"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleAddMore}
                            className="flex-1 bg-[#142A52] hover:bg-[#0f1f3a] text-white font-bold py-3 rounded-lg"
                        >
                            Confirm Add
                        </Button>
                    </div>
                </div>
            )}

            {/* Pricing Summary Card */}
            {cartBreakdown && (
                <div className="mt-8 bg-gradient-to-br from-[#142A52] via-[#1a3a6f] to-[#0f1f3a] text-white rounded-2xl shadow-xl p-8 border border-[#C89B2B]/30 hidden lg:block">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-2xl font-bold">Order Summary</h3>
                        <Zap className="w-6 h-6 text-[#C89B2B]" />
                    </div>

                    <div className="space-y-3 mb-6">
                        <div className="flex justify-between items-center">
                            <span className="text-white/80">Base Price</span>
                            <span className="font-bold text-white">${cartBreakdown.basePrice.toFixed(2)}</span>
                        </div>
                        {cartBreakdown.surcharges > 0 && (
                            <div className="flex justify-between items-center text-[#C89B2B]">
                                <span>Heavy Material Surcharges</span>
                                <span className="font-bold">${cartBreakdown.surcharges.toFixed(2)}</span>
                            </div>
                        )}
                        <div className="flex justify-between items-center">
                            <span className="text-white/80">Shipping & Delivery</span>
                            <span className="font-bold text-white">${cartBreakdown.shipping.toFixed(2)}</span>
                        </div>
                        {cartBreakdown.extraDays > 0 && (
                            <div className="flex justify-between items-center text-[#C89B2B]">
                                <span>Extra Rental Charges</span>
                                <span className="font-bold">${cartBreakdown.extraDays.toFixed(2)}</span>
                            </div>
                        )}
                        {accountCreation && (
                            <div className="flex justify-between items-center text-green-400">
                                <span>Account Discount</span>
                                <span className="font-bold">-${ACCOUNT_DISCOUNT.toFixed(2)}</span>
                            </div>
                        )}
                    </div>

                    <div className="flex justify-between items-center pt-4 border-t border-white/20">
                        <span className="text-xl pl-2 font-bold">Total Amount</span>
                        <span className="text-3xl font-bold text-[#C89B2B]">${(cartTotal || 0).toFixed(2)}</span>
                    </div>
                    <p className="text-xs text-white/60 mt-4">
                        💡 Includes all selected dumpsters, shipping, and extra rental periods.
                    </p>
                </div>
            )}
        </div>
    );
}
