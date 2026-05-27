"use client";

import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import DumpsterSize from "@/components/home/dumpster-size";
import { WeightPriceEstimator } from "@/components/home/weight-price-estimator";

import { motion } from "framer-motion";
import Link from "next/link";

import { Button } from "@/components/ui/button";

import {
  ArrowRight,
  Truck,
  Building2,
  ShieldCheck,
  Home,
  Hammer,
  Recycle,
  CheckCircle,
  ChevronRight,
  Phone,
  Sparkles,
  ClipboardCheck,
  CalendarCheck
} from "lucide-react";

export default function DumpstersPage() {

  return (
    <div className="min-h-screen flex flex-col">

      <Header />

      <main className="flex-1">




        {/* BREADCRUMB */}

        <section className="border-b bg-white">

          <div className="max-w-7xl mx-auto px-5 py-4">

            <div className="
                flex
                items-center
                gap-2
                text-sm
                text-gray-500
                flex-wrap
                ">

              <Link href="/">

                Home

              </Link>

              <ChevronRight className="h-4 w-4" />

              <span className="font-bold text-[#0A1628]">

                Dumpsters

              </span>

            </div>

          </div>

        </section>



        {/* HERO */}

        <section
          className="
    relative
    overflow-hidden
    bg-gradient-to-r
    from-[#0A1628]
    via-[#183867]
    to-[#0A1628]
  "
        >
          <div className="max-w-7xl mx-auto px-5 py-8 md:py-10">

            <div className="max-w-4xl mx-auto text-center">

              <div
                className="
        inline-flex
        items-center
        rounded-full
        px-4
        py-2
        bg-white/10
        text-white
        mb-4
        text-sm
        font-medium
        "
              >
                Professional Dumpster Rentals
              </div>

              <h1
                className="
        text-[30px]
        sm:text-4xl
        lg:text-5xl
        font-black
        text-white
        leading-[1.1]
        "
              >
                Dumpster Solutions For Every Cleanup Project
              </h1>

              <p
                className="
        mt-4
        text-white/85
        text-sm
        md:text-base
        max-w-2xl
        mx-auto
        leading-7
        "
              >
                Residential cleanups, construction projects,
                roofing jobs and long-term waste solutions.
                Fast delivery, flexible rental periods and
                dependable service for projects of every size.
              </p>

              <div
                className="
        flex
        flex-col
        sm:flex-row
        justify-center
        gap-3
        mt-6
        "
              >
                <Button
                  asChild
                  className="
            h-12
            px-6
            rounded-2xl
            bg-gradient-to-r
            from-[#B8860B]
            via-[#FFD700]
            to-[#DAA520]
            text-[#0A1628]
            font-bold
            w-full
            sm:w-auto
          "
                >
                  <Link href="/smart-assessment">
                    <Sparkles size={18} className="mr-2" />
                    Find My Dumpster
                  </Link>
                </Button>

                <Button
                  variant="outline"
                  className="
            h-12
            px-6
            rounded-2xl
            border-white/30
            bg-white/10
            text-white
            hover:bg-white
            hover:text-[#0A1628]
            w-full
            sm:w-auto
          "
                  onClick={() =>
                    document
                      .getElementById("dumpster-size")
                      ?.scrollIntoView({
                        behavior: "smooth"
                      })
                  }
                >
                  View Dumpsters
                </Button>

              </div>

            </div>

          </div>
        </section>

        {/* SERVICES */}

        <section className="py-24">

          <div className="max-w-7xl mx-auto px-5">

            <div className="text-center mb-16">

              <h2 className="text-4xl font-black">

                Dumpster Rental Services Built Around Every Project

              </h2>

              <p className="text-slate-600 mt-4 max-w-4xl mx-auto leading-8">

                BlueSky Disposal provides dependable dumpster rental services for
                homeowners, contractors and businesses looking for an easier way to
                manage waste removal. Whether you need a temporary roll-off dumpster
                for a home renovation, a construction dumpster for heavy debris, or
                a long-term commercial waste solution, we help make cleanup simple,
                affordable and efficient. Our dumpster rental options are designed
                for projects of every size—from small garage cleanouts to large-scale
                construction sites and ongoing business operations.

              </p>

            </div>



            <div className="space-y-28">


              {/* Residential */}

              <div className="grid lg:grid-cols-2 gap-16 items-center">

                <img
                  src="https://res.cloudinary.com/dett0ni5j/image/upload/v1779443598/Residential_Dumpster_us3vl5.png"
                  className="rounded-3xl shadow-xl"
                  alt="Residential dumpster rental service"
                />

                <div>

                  <span className="text-blue-600 font-semibold">

                    Residential Dumpster Services

                  </span>

                  <h3 className="text-4xl font-black mt-3">

                    Dumpster Rentals For Homeowners & Residential Projects

                  </h3>

                  <p className="mt-6 text-slate-600 leading-8">

                    Home cleanup projects create more waste than most people expect.
                    Whether you're cleaning out a garage, remodeling a kitchen,
                    replacing a roof, decluttering before a move, or handling a
                    full-property cleanout, our residential dumpster rental service
                    keeps debris contained and cleanup organized.

                  </p>

                  <p className="mt-5 text-slate-600 leading-8">

                    Our roll-off dumpsters provide a convenient way to dispose of
                    household junk, renovation debris, furniture, yard waste,
                    drywall, flooring and roofing materials without making multiple
                    trips to a landfill.

                  </p>

                  <div className="grid grid-cols-2 gap-3 mt-8">

                    {[
                      "Garage Cleanouts",
                      "Kitchen Remodels",
                      "Roof Replacement",
                      "Household Junk Removal"
                    ].map(item=>(

                      <div
                        key={item}
                        className="flex items-center gap-2"
                      >

                        <CheckCircle
                          size={18}
                          className="text-green-500"
                        />

                        <span className="text-sm">

                          {item}

                        </span>

                      </div>

                    ))}

                  </div>

                </div>

              </div>



              {/* Construction */}

              <div className="grid lg:grid-cols-2 gap-16 items-center">

                <div>

                  <span className="text-blue-600 font-semibold">

                    Construction Dumpster Services

                  </span>

                  <h3 className="text-4xl font-black mt-3">

                    Construction Dumpster Rentals For Jobsite Waste Removal

                  </h3>

                  <p className="mt-6 text-slate-600 leading-8">

                    Keep your jobsite clean, safe and running efficiently with
                    construction dumpster rental solutions designed for contractors,
                    builders and project managers. Construction projects generate
                    large amounts of debris, and having a dumpster nearby helps keep
                    materials organized while reducing delays.

                  </p>

                  <p className="mt-5 text-slate-600 leading-8">

                    Our construction dumpsters are ideal for concrete, demolition
                    waste, lumber, shingles, drywall, brick, roofing debris and
                    heavy materials generated during renovations and new builds.

                  </p>

                  <div className="grid grid-cols-2 gap-3 mt-8">

                    {[
                      "Demolition Debris",
                      "Roofing Projects",
                      "Concrete Disposal",
                      "Construction Cleanup"
                    ].map(item=>(

                      <div
                        key={item}
                        className="flex items-center gap-2"
                      >

                        <CheckCircle
                          size={18}
                          className="text-green-500"
                        />

                        <span className="text-sm">

                          {item}

                        </span>

                      </div>

                    ))}

                  </div>

                </div>

                <img
                  src="https://res.cloudinary.com/dett0ni5j/image/upload/v1779443598/Construction_Dumpster_vryehm.png"
                  className="rounded-3xl shadow-xl"
                  alt="Construction dumpster rental"
                />

              </div>



              {/* Commercial */}

              <div className="grid lg:grid-cols-2 gap-16 items-center">

                <img
                  src="https://res.cloudinary.com/dett0ni5j/image/upload/v1779443598/Commercial_Dumpster_noxyj7.png"
                  className="rounded-3xl shadow-xl"
                  alt="Commercial dumpster service"
                />

                <div>

                  <span className="text-blue-600 font-semibold">

                    Commercial Dumpster Services

                  </span>

                  <h3 className="text-4xl font-black mt-3">

                    Long-Term Commercial Waste Management Solutions

                  </h3>

                  <p className="mt-6 text-slate-600 leading-8">

                    Businesses require dependable waste management solutions that
                    fit daily operations. Our commercial dumpster service provides
                    flexible long-term dumpster rentals and scheduled pickup options
                    for offices, restaurants, retail stores, apartment communities,
                    warehouses and commercial facilities.

                  </p>

                  <p className="mt-5 text-slate-600 leading-8">

                    Whether you need permanent dumpsters or recurring waste pickup,
                    we help streamline disposal while keeping your property clean
                    and operating efficiently.

                  </p>

                  <div className="grid grid-cols-2 gap-3 mt-8">

                    {[
                      "Retail Locations",
                      "Restaurants",
                      "Office Buildings",
                      "Apartment Communities"
                    ].map(item=>(

                      <div
                        key={item}
                        className="flex items-center gap-2"
                      >

                        <CheckCircle
                          size={18}
                          className="text-green-500"
                        />

                        <span className="text-sm">

                          {item}

                        </span>

                      </div>

                    ))}

                  </div>

                </div>

              </div>

            </div>

          </div>

        </section>


        {/* DUMPSTER SIZE COMPONENT */}

        <section
          id="dumpster-size"
          className="pb-24"
        >

          <div className="max-w-7xl mx-auto px-5">

            <DumpsterSize />

          </div>

        </section>


        {/* WHY BLUESKY */}

        <section className="py-24 bg-slate-50 overflow-hidden">

          <div className="max-w-7xl mx-auto px-5">

            <div className="text-center max-w-4xl mx-auto mb-16">

              <span className="text-blue-600 font-semibold">

                Why Customers Choose BlueSky Disposal

              </span>

              <h2 className="text-4xl lg:text-5xl font-black mt-4">

                Reliable Dumpster Rental Services Designed Around Your Needs

              </h2>

              <p className="text-slate-600 mt-6 leading-8">

                Choosing the right dumpster rental company can make a major
                difference in the success of your cleanup project. At BlueSky
                Disposal, we focus on making waste removal easier through reliable
                service, transparent pricing and flexible rental options.
                Whether you need a residential roll-off dumpster, a construction
                dumpster for heavy debris or long-term commercial waste solutions,
                our team helps simplify the process from delivery through pickup.

              </p>

            </div>


            <div className="grid lg:grid-cols-3 gap-8">

              {[
                {
                  title: "Transparent & Upfront Pricing",
                  number: "01",
                  desc: "No hidden fees and no surprise charges. Our dumpster rental pricing is straightforward and easy to understand, helping homeowners, contractors and businesses stay on budget while planning cleanup projects of any size."
                },

                {
                  title: "Dedicated Customer Support",
                  number: "02",
                  desc: "Our team assists throughout your entire rental experience. From selecting the correct dumpster size to scheduling delivery and pickup, we provide personalized support to ensure your waste removal process stays simple."
                },

                {
                  title: "Flexible Scheduling Options",
                  number: "03",
                  desc: "Every cleanup project works on a different timeline. We offer flexible dumpster rental periods and scheduling options so you can keep your dumpster as long as your project requires."
                },

                {
                  title: "Fast Dumpster Delivery & Pickup",
                  number: "04",
                  desc: "Need a dumpster quickly? Our fast delivery and responsive pickup process helps avoid delays and keeps your home project, renovation or construction site running smoothly."
                },

                {
                  title: "Multiple Dumpster Sizes Available",
                  number: "05",
                  desc: "From smaller residential projects to large-scale construction waste removal, we provide multiple dumpster sizes designed to handle everything from household junk and roofing debris to demolition materials."
                },

                {
                  title: "Simple Rental Process",
                  number: "06",
                  desc: "We remove confusion from the dumpster rental process. Get recommendations using our AI dumpster assistant, browse available sizes and schedule your rental in only a few steps."
                }

              ].map((item, index) => (

                <div
                  key={item.title}
                  className="group relative rounded-[32px] bg-white p-8 shadow-md hover:shadow-2xl border border-slate-100 transition duration-500 hover:-translate-y-2 overflow-hidden"
                >

                  <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-blue-50 translate-x-10 -translate-y-10 group-hover:scale-150 transition duration-700" />

                  <div className="relative">

                    <div className="flex items-center justify-between">

                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 flex items-center justify-center">

                        <CheckCircle
                          className="text-white"
                          size={22}
                        />

                      </div>

                      <span className="text-5xl font-black text-slate-100">

                        {item.number}

                      </span>

                    </div>


                    <h3 className="mt-8 text-2xl font-black text-slate-900">

                      {item.title}

                    </h3>

                    <p className="mt-5 text-slate-600 leading-8">

                      {item.desc}

                    </p>

                  </div>

                </div>

              ))}

            </div>


            <div className="mt-20 rounded-[40px] bg-gradient-to-r from-[#0B4ECF] to-cyan-500 text-white p-10 lg:p-14">

              <div className="grid lg:grid-cols-2 gap-10 items-center">

                <div>

                  <h3 className="text-3xl font-black">

                    Professional Dumpster Rentals For Every Cleanup Project

                  </h3>

                  <p className="mt-5 text-blue-100 leading-8">

                    Whether you're handling a home cleanout, remodeling project,
                    roofing replacement, construction site cleanup or commercial
                    waste management, BlueSky Disposal provides dependable dumpster
                    rental services with flexible scheduling and reliable support.

                  </p>

                </div>


                <div className="grid grid-cols-2 gap-4">

                  {[
                    "Residential Dumpster Rental",
                    "Affordable Dumpster Rentals",
                    "Construction Waste Removal",
                    "Commercial Dumpster Service"
                  ].map((item) => (

                    <div
                      key={item}
                      className="bg-white/10 backdrop-blur rounded-2xl p-4"
                    >

                      <div className="flex gap-3 items-start">

                        <CheckCircle
                          size={18}
                          className="mt-1"
                        />

                        <span>

                          {item}

                        </span>

                      </div>

                    </div>

                  ))}

                </div>

              </div>

            </div>

          </div>

        </section>



        {/* DUMPSTER PERMIT GUIDE */}

        <section className="py-24 bg-slate-50">

          <div className="max-w-7xl mx-auto px-5">

            <div className="grid lg:grid-cols-2 gap-16 items-center">

              {/* LEFT CONTENT */}

              <div>

                <span className="text-blue-600 font-semibold">

                  Dumpster Rental Permit Information

                </span>

                <h2 className="text-4xl lg:text-5xl font-black mt-4 leading-tight">

                  Do You Need A Permit For Your Dumpster Rental?

                </h2>

                <p className="mt-6 text-slate-600 leading-8">

                  One of the most common questions customers ask before renting a
                  dumpster is whether a permit is required. Permit requirements
                  vary depending on your city, neighborhood and where the dumpster
                  will be placed during your rental period.

                </p>

                <p className="mt-6 text-slate-600 leading-8">

                  In many cases, dumpsters placed entirely on private property —
                  such as driveways or construction sites — may not require a
                  permit. However, if your dumpster will sit on a public street,
                  sidewalk, alley or other public space, local regulations may
                  require approval before delivery.

                </p>

                <p className="mt-6 text-slate-600 leading-8">

                  Understanding local dumpster permit requirements before ordering
                  can help avoid delays, fines and project interruptions. Because
                  regulations vary by city, we've created a complete permit guide
                  to help you understand requirements and common rules.

                </p>


              
                <Link href="/dumpster-permits">

                  <Button
                    size="lg"
                    className="mt-10 rounded-2xl"
                  >

                    View Complete Permit Guide

                    <ArrowRight
                      size={18}
                      className="ml-2"
                    />

                  </Button>

                </Link>

              </div>


              {/* RIGHT SIDE */}

              <div className="relative">

                <div className="
                    rounded-[40px]
                    bg-white
                    p-8
                    shadow-xl
                    border
                    ">

                  <div className="space-y-6">

                    {[
                      {
                        title: "Private Driveway Placement",
                        text: "Typically does not require permits in many areas."
                      },
                      {
                        title: "Street Placement",
                        text: "Often requires approval from your local city office."
                      },
                      {
                        title: "HOA Restrictions",
                        text: "Some communities have additional placement rules."
                      }
                    ].map((item, index) => (

                      <div
                        key={item.title}
                        className="flex gap-5"
                      >

                        <div className="
                            w-12
                            h-12
                            rounded-2xl
                            bg-gradient-to-r
                            from-blue-600
                            to-cyan-500
                            text-white
                            flex
                            items-center
                            justify-center
                            font-bold
                            ">

                          0{index + 1}

                        </div>

                        <div>

                          <h4 className="font-bold text-lg">

                            {item.title}

                          </h4>

                          <p className="text-slate-600 mt-2">

                            {item.text}

                          </p>

                        </div>

                      </div>

                    ))}

                  </div>

                </div>


                <div className="
                    absolute
                    -z-10
                    -right-6
                    -bottom-6
                    w-full
                    h-full
                    rounded-[40px]
                    bg-gradient-to-r
                    from-blue-100
                    to-cyan-100
                    " />

              </div>

            </div>

          </div>

        </section>

        {/* FINAL CTA */}

        <section className="py-28 bg-white overflow-hidden relative">

          <div className="relative max-w-6xl mx-auto px-5">

            {/* keep this blue card unchanged */}

            <div className="
      relative
      overflow-hidden
      rounded-[40px]
      bg-gradient-to-br
      from-[#0B4ECF]
      via-[#1463FF]
      to-cyan-500
      p-8
      lg:p-14
      shadow-[0_25px_80px_rgba(11,78,207,0.25)]
    ">

              {/* floating bg elements */}

              <motion.div
                animate={{
                  x: [0, 50, 0],
                  y: [0, -30, 0]
                }}
                transition={{
                  duration: 12,
                  repeat: Infinity
                }}
                className="absolute top-0 right-0 w-[350px] h-[350px] rounded-full bg-white/10 blur-3xl"
              />

              <motion.div
                animate={{
                  x: [0, -40, 0],
                  y: [0, 50, 0]
                }}
                transition={{
                  duration: 10,
                  repeat: Infinity
                }}
                className="absolute bottom-0 left-0 w-[300px] h-[300px] rounded-full bg-cyan-300/10 blur-3xl"
              />


              <div className="relative grid lg:grid-cols-2 gap-14 items-center">

                {/* LEFT */}

                <div>

                  <span className="inline-flex px-4 py-2 rounded-full bg-white/10 text-sm text-white">

                    Fast • Flexible • Reliable

                  </span>

                  <h2 className="mt-6 text-4xl lg:text-6xl font-black text-white leading-tight">

                    Ready To Rent Your Dumpster?

                  </h2>

                  <p className="mt-6 text-blue-100 text-lg leading-8">

                    Whether you're cleaning out a home, managing a
                    construction project, handling renovation debris
                    or looking for long-term waste solutions, we make
                    dumpster rentals simple with fast delivery and
                    dependable support.

                  </p>


                  <div className="flex flex-wrap gap-4 mt-10">

                    <Button
                      size="lg"
                      className="
              bg-white
              text-blue-700
              hover:bg-blue-50
              h-14
              px-8
              rounded-2xl
              font-bold
              "
                    >

                      Order Online

                    </Button>


                    <Button
                      size="lg"
                      className="
              h-14
              px-8
              rounded-2xl
              border-2
              border-white
              bg-transparent
              text-white
              hover:bg-white
              hover:text-blue-700
              font-bold
              "
                    >

                      <Phone
                        size={18}
                        className="mr-2"
                      />

                      Call Now

                    </Button>

                  </div>

                </div>


                {/* RIGHT */}

                <div className="grid grid-cols-2 gap-5">

                  {[
                    {
                      value: "10+",
                      label: "Dumpster Sizes"
                    },
                    {
                      value: "Fast",
                      label: "Delivery Available"
                    },
                    {
                      value: "Flexible",
                      label: "Rental Periods"
                    },
                    {
                      value: "24/7",
                      label: "Support Team"
                    }

                  ].map((item) => (

                    <div
                      key={item.label}
                      className="
              rounded-3xl
              p-6
              bg-white/10
              backdrop-blur
              border
              border-white/10
              hover:bg-white/20
              transition
              "
                    >

                      <div className="text-3xl font-black text-white">

                        {item.value}

                      </div>

                      <div className="text-blue-100 mt-2">

                        {item.label}

                      </div>

                    </div>

                  ))}

                </div>

              </div>

            </div>

          </div>

        </section>
      </main>

      <Footer />

    </div>
  );
}