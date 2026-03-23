"use client";

import React, { createContext, useContext, useState } from "react";

export interface BookingData {
  // Address & Delivery
  address: string;
  zipCode: string;
  deliveryDate: string;
  rentalPeriod: number; // days

  // Project Details
  projectType: string;
  materialType: string;

  // Dumpster Selection
  dumpsterType: string;
  dumpsterSize: number;

  // Contact Info
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company?: string;
  placementInstructions?: string;

  // Pricing
  basePrice: number;
  surcharges: number;
  accountDiscount: number;
  totalPrice: number;

  // Additional Info
  addMattress?: boolean;
  mattressCount?: number;
  specialRequests?: string;
}

interface BookingContextType {
  booking: Partial<BookingData>;
  updateBooking: (data: Partial<BookingData>) => void;
  resetBooking: () => void;
  getOrderSummary: () => Partial<BookingData>;
}

const defaultBooking: Partial<BookingData> = {
  address: "",
  zipCode: "",
  deliveryDate: "",
  rentalPeriod: 7,
  projectType: "",
  materialType: "",
  dumpsterType: "roll-off",
  dumpsterSize: 20,
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  company: "",
  placementInstructions: "",
  basePrice: 455,
  surcharges: 0,
  accountDiscount: 0,
  totalPrice: 455,
};

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export function BookingProvider({ children }: { children: React.ReactNode }) {
  const [booking, setBooking] = useState<Partial<BookingData>>(defaultBooking);

  const updateBooking = (data: Partial<BookingData>) => {
    setBooking((prev) => ({ ...prev, ...data }));
  };

  const resetBooking = () => {
    setBooking(defaultBooking);
  };

  const getOrderSummary = () => {
    return booking;
  };

  return (
    <BookingContext.Provider value={{ booking, updateBooking, resetBooking, getOrderSummary }}>
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
