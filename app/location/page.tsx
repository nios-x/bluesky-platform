// app/location/page.tsx

"use client";

import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import Link from "next/link";
import { useMemo, useState } from "react";

import {
  MapPin,
  ChevronRight,
  Search,
  Truck,
  Clock,
  Shield,
  Home,
} from "lucide-react";

const SERVICE_LOCATIONS = [
  { name: "Washtenaw County", state: "Michigan" },
  { name: "Lapeer County", state: "Michigan" },
  { name: "Genesee County", state: "Michigan" },
  { name: "Livingston County", state: "Michigan" },
  { name: "Monroe County", state: "Michigan" },
  { name: "St Clair County", state: "Michigan" },
  { name: "Clinton County", state: "Michigan" },
  { name: "Ingham County", state: "Michigan" },
  { name: "Shiawassee County", state: "Michigan" },
  { name: "Bay County", state: "Michigan" },
  { name: "Saginaw County", state: "Michigan" },
  { name: "Tuscola County", state: "Michigan" },
  { name: "Mecosta County", state: "Michigan" },
  { name: "Gratiot County", state: "Michigan" },
  { name: "Midland County", state: "Michigan" },
  { name: "Gladwin County", state: "Michigan" },
  { name: "Isabella County", state: "Michigan" },
  { name: "Huron County", state: "Michigan" },
  { name: "Antrim County", state: "Michigan" },
  { name: "Emmet County", state: "Michigan" },
  { name: "Cheboygan County", state: "Michigan" },
  { name: "Clare County", state: "Michigan" },
  { name: "Iosco County", state: "Michigan" },
  { name: "Kent County", state: "Michigan" },
  { name: "Montmorency County", state: "Michigan" },
  { name: "Manchester County", state: "Michigan" },
  { name: "Macomb County", state: "Michigan" },
  { name: "Kalamazoo County", state: "Michigan" },
  { name: "Oakland County", state: "Michigan" },
  { name: "Jackson County", state: "Michigan" },
  { name: "Wayne County", state: "Michigan" },

  { name: "Miami-Dade County", state: "Florida" },
  { name: "Los Angeles County", state: "California" },
  { name: "Cook County", state: "Illinois" },
];

export default function LocationsPage() {
  const [search, setSearch] = useState("");

  const filteredLocations = useMemo(() => {
    return SERVICE_LOCATIONS.filter(
      (location) =>
        location.name
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        location.state
          .toLowerCase()
          .includes(search.toLowerCase())
    );
  }, [search]);

  return (
    <main className="bg-white min-h-screen">

      <Header />


      {/* BREADCRUMB */}

      <section className="bg-[#f8fafc] border-b">

        <div className="max-w-7xl mx-auto px-4 md:px-6 py-3">

          <div className="flex items-center text-sm text-gray-500">

            <Link
              href="/"
              className="hover:text-[#0A1628]"
            >
              Home
            </Link>

            <ChevronRight className="h-4 w-4 mx-2" />

            <span className="font-medium text-[#0A1628]">
              Location
            </span>

          </div>

        </div>

      </section>

      {/* HERO */}

      <section className="relative overflow-hidden bg-gradient-to-r from-[#0A1628] via-[#183867] to-[#0A1628]">

        <div className="max-w-7xl mx-auto px-5 py-12 md:py-20">          

          <div className="text-center max-w-4xl mx-auto">

            <div className="inline-flex items-center rounded-full px-4 py-2 bg-white/10 text-white mb-6">

              <MapPin className="w-4 h-4 mr-2" />

              Michigan + Growing Nationwide

            </div>

            <h1 className="text-4xl md:text-6xl font-black text-white leading-tight">

              Dumpster Rental Locations

            </h1>

            <p className="mt-6 text-white/85 text-lg">

              Browse our active service areas and quickly
              find dumpster availability near your project.

            </p>

            {/* SEARCH */}

            <div className="mt-10 max-w-2xl mx-auto">

              <div className="bg-white rounded-2xl p-3 shadow-2xl">

                <div className="flex items-center">

                  <Search
                    className="text-gray-400 ml-3"
                    size={20}
                  />

                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search county or state..."
                    className="
                    flex-1
                    px-4
                    py-4
                    outline-none
                    text-black
                    text-base
                    "
                  />

                </div>

              </div>

            </div>

          </div>

        </div>

      </section>

      {/* TRUST */}

      <section className="border-y bg-[#fafafa]">

        <div className="max-w-7xl mx-auto px-5 py-10">

          <div className="grid md:grid-cols-3 gap-8">

            <div className="flex gap-4">

              <Truck className="text-[#C89B2B]" />

              <div>

                <h3 className="font-bold">

                  Fast Delivery

                </h3>

                <p className="text-sm text-gray-500">

                  Same-day options available

                </p>

              </div>

            </div>

            <div className="flex gap-4">

              <Clock className="text-[#C89B2B]" />

              <div>

                <h3 className="font-bold">

                  Flexible Rentals

                </h3>

                <p className="text-sm text-gray-500">

                  Rental periods that fit your project

                </p>

              </div>

            </div>

            <div className="flex gap-4">

              <Shield className="text-[#C89B2B]" />

              <div>

                <h3 className="font-bold">

                  No Hidden Fees

                </h3>

                <p className="text-sm text-gray-500">

                  Transparent pricing always

                </p>

              </div>

            </div>

          </div>

        </div>

      </section>

      {/* LOCATIONS */}

      <section className="py-20 px-5">

        <div className="max-w-7xl mx-auto">

          <div className="text-center mb-12">

            <h2 className="text-4xl font-black text-[#0A1628]">

              Areas We Serve

            </h2>

            <p className="mt-4 text-gray-500">

              {filteredLocations.length} service locations found

            </p>

          </div>

          <div className="
          grid
          sm:grid-cols-2
          lg:grid-cols-3
          xl:grid-cols-4
          gap-6
          ">

            {filteredLocations.map((location) => {

              const slug = location.name
                .replace(" County", "")
                .toLowerCase()
                .replace(/\s+/g, "-");

              const description =
                location.state === "Michigan"
                  ? "Residential, construction and commercial dumpster rentals available."
                  : "Now expanding service availability in this area.";

              return (

                <Link
                  key={location.name}
                  href={`/location/${slug}`}
                >

                  <div className="
                  h-full
                  rounded-3xl
                  border
                  bg-white
                  p-6
                  hover:-translate-y-2
                  hover:shadow-2xl
                  transition-all
                  group
                  ">

                    <div className="flex justify-between mb-5">

                      <div className="
                      h-12
                      w-12
                      rounded-xl
                      bg-[#0A1628]/10
                      flex
                      items-center
                      justify-center">

                        <MapPin
                          className="text-[#C89B2B]"
                        />

                      </div>

                      <ChevronRight
                        className="
                      opacity-0
                      group-hover:opacity-100
                      transition
                      text-[#C89B2B]
                      "/>

                    </div>

                    <h3 className="
                    text-xl
                    font-bold
                    text-[#0A1628]
                    ">

                      {location.name}

                    </h3>

                    <p className="text-sm text-gray-500 mt-3">

                      {description}

                    </p>

                  </div>

                </Link>

              )

            })}

          </div>

        </div>

      </section>

      {/* CTA BOX */}

      <section className="px-5 pb-0">

        <div className="
        max-w-7xl
        mx-auto
        rounded-[40px]
        overflow-hidden
        bg-gradient-to-r
        from-[#0A1628]
        to-[#183867]
        px-6
        md:px-14
        py-14
        ">

          <div className="text-center">

            <h2 className="text-white text-3xl md:text-5xl font-black">

              Ready To Rent Your Dumpster?

            </h2>

            <p className="text-white/80 mt-5 max-w-2xl mx-auto">

              Book online instantly or speak with our team.

            </p>

            <div className="
            flex
            flex-col
            sm:flex-row
            justify-center
            gap-4
            mt-8
            ">

              <Link href="/">

                <button className="
                bg-[#C89B2B]
                px-8
                py-4
                rounded-xl
                font-bold
                hover:scale-105
                transition
                ">

                  Order Online

                </button>

              </Link>

              <Link href="/contact">

                <button className="
                border
                border-white
                text-white
                px-8
                py-4
                rounded-xl
                font-bold
                hover:bg-white
                hover:text-[#0A1628]
                transition
                ">

                  Contact Us

                </button>

              </Link>

            </div>

          </div>

        </div>

      </section>

      <Footer />

    </main>
  );
}