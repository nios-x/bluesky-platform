"use client";

import React, { createContext, useContext, useState } from "react";

export interface BookingData {
  address: string;
  zipCode: string;
  deliveryDate: string;
  removalDate?: string;
  rentalPeriod: number;
  state?: string;
  city?: string;
  shippingStreet?: string;
  
  projectType: string;
  materialType: string;

  dumpsterType: string;
  dumpsterSize: number;
  dumpsterSizeId?: string;
  dumpsterCapacity?: number; // Weight capacity in tons

  fullName: string;
  email: string;
  phone: string;
  company?: string;
  placementInstructions?: string;

  basePrice: number;
  surcharges: number;
  accountDiscount: number;
  totalPrice: number;

  paymentMethod?: "google-pay" | "credit-card" | "paypal" | "stripe" | string;
  paymentIntentId?: string;
  paymentStatus?: "completed" | "pending" | "failed";

  addMattress?: boolean;
  mattressCount?: number;
  specialRequests?: string;
}

interface BookingContextType {
  bookings: BookingData[];
  addBooking: (data: BookingData) => void;
  updateBooking: (index: number, data: Partial<BookingData>) => void;
  removeBooking: (index: number) => void;
  resetBookings: () => void;
  getOrderSummary: (index: number) => BookingData | undefined;
}


const BookingContext = createContext<any>(undefined);

const defaultBooking: BookingData = { address: "", zipCode: "", deliveryDate: "", rentalPeriod: 0, projectType: "", materialType: "", dumpsterType: "", dumpsterSize: 0, fullName: "", email: "", phone: "", basePrice: 0, surcharges: 0, accountDiscount: 0, totalPrice: 0 };

export function BookingProvider({ children }: { children: React.ReactNode }) {
  const [bookings, setBookings] = useState<BookingData[]>([defaultBooking]);

  // Add new booking
  const addBooking = (data: BookingData) => {
    setBookings((prev) => [...prev, data]);
  };

  // Update specific booking
  const updateBooking = (index: number, data: Partial<BookingData>) => {
    setBookings((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, ...data } : item
      )
    );
  };

  // Remove booking
  const removeBooking = (index: number) => {
    setBookings((prev) => prev.filter((_, i) => i !== index));
  };

  // Reset
  const resetBookings = () => {
    setBookings([defaultBooking]);
  };

  // Get one booking
  const getOrderSummary = (index: number) => {
    return bookings[index];
  };

  return (
    <BookingContext.Provider
      value={{
        bookings,
        addBooking,
        updateBooking,
        removeBooking,
        resetBookings,
        getOrderSummary,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
}

export function useBooking() {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error("useBooking must be used within BookingProvider");
  }
  return context;
}

export default BookingProvider;