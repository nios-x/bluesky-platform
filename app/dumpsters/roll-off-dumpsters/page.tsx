// app/dumpsters/roll-off-dumpsters/page.tsx

import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import RollOffFaq from "@/app/dumpsters/roll-off-dumpsters/rolloff-faq";

import Link from "next/link";
import Image from "next/image";

import {
  ChevronRight,
  Bot
} from "lucide-react";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getDumpstersByType } from "@/lib/models/dumpster";

export default async function RollOffPage() {

  const supabase =
    await createSupabaseServerClient();

  let dumpsters =
    await getDumpstersByType(
      supabase,
      "roll-off-dumpsters"
    );

  function getImage(dumpster: any) {
    return (
      dumpster.image_cover ||
      dumpster.images?.[0]
    );
  }

  return (

    <main className="bg-white overflow-x-hidden">

      <Header />

      {/* breadcrumb */}

      <section className="border-b bg-white">

        <div className="max-w-7xl mx-auto px-5 py-4">

          <div className="flex items-center gap-2 text-sm text-gray-500 flex-wrap">

            <Link href="/">
              Home
            </Link>

            <ChevronRight className="h-4 w-4" />

            <Link href="/dumpsters">
              Dumpsters
            </Link>

            <ChevronRight className="h-4 w-4" />

            <span className="font-bold text-[#0A1628]">

              Roll-Off Dumpsters

            </span>

          </div>

        </div>

      </section>


      {/* HERO */}

      <section className="bg-[#0A1628] overflow-hidden">

        <div className="max-w-7xl mx-auto px-5 py-10">

          <div className="grid lg:grid-cols-2 gap-8 items-center">

            <div>

              <div className="inline-flex px-4 py-2 rounded-full bg-[#FFD700]/10 text-[#FFD700] text-sm font-bold mb-5">

                Construction & Cleanup Solutions

              </div>

              <h1 className="text-3xl lg:text-5xl font-black text-white leading-tight">

                Roll-Off Dumpster Rentals

              </h1>

              <p className="mt-5 text-gray-300 max-w-xl">

                Reliable roll-off dumpsters for construction debris, home renovations, roofing projects, estate cleanouts and large waste removal jobs.

              </p>

              <div className="flex gap-4 flex-wrap mt-8">

                <Button
                  asChild
                  className="bg-gradient-to-r from-[#B8860B] via-[#FFD700] to-[#DAA520] text-[#0A1628] font-bold"
                >
                  <Link href="/book">

                    Book Online

                  </Link>

                </Button>

                <Button
                  variant="outline"
                  className="border-white text-[#0A1628]"
                  asChild
                >

                  <Link href="/dumpsters">

                    View Sizes

                  </Link>

                </Button>

              </div>

            </div>


            <div>

              <div className="bg-white rounded-[30px] p-4">

                <Image
                  src={getImage(dumpsters[0])}
                  alt=""
                  width={650}
                  height={280}
                  unoptimized
                  className="w-full h-[220px] lg:h-[260px] object-contain"
                />

              </div>

            </div>

          </div>

        </div>

      </section>



      {/* COMPARISON */}

      <section className="py-16 bg-[#F8FAFC]">

        <div className="max-w-7xl mx-auto px-4">

          <div className="text-center mb-10">

            <span className="inline-flex rounded-full px-4 py-2 bg-[#FFD700]/10 text-[#1B3A6B] font-bold text-sm">

              Dumpster Comparison Chart

            </span>

            <h2 className="text-3xl lg:text-5xl font-black text-[#0A1628] mt-5">

              Compare Roll-Off Dumpster Sizes

            </h2>

            <p className="mt-5 text-gray-600 max-w-2xl mx-auto">

              Compare dimensions, capacity and included rental periods.

            </p>

          </div>


          <div className="rounded-[25px] overflow-x-auto border shadow-xl bg-white">

            <table className="w-full min-w-[600px] table-fixed text-[10px] sm:text-xs md:text-sm lg:text-base">

              <thead>

                <tr className="bg-[#0A1628] text-white">

                  <th className="p-2 sm:p-4">
                    Size
                  </th>

                  <th className="p-2 sm:p-4">
                    Dimensions
                  </th>

                  <th className="p-2 sm:p-4">
                    Capacity
                  </th>

                  <th className="p-2 sm:p-4">
                    Rental
                  </th>

                </tr>

              </thead>

              <tbody>

                {dumpsters.map(
                  (dumpster: any, index: number) => {

                    const size =
                      dumpster.dumpster_sizes;

                    return (

                      <tr
                        key={dumpster.id}
                        className={
                          index % 2 === 0
                            ? "bg-white"
                            : "bg-slate-50"
                        }
                      >

                        <td className="p-2 sm:p-4">

                          <p className="font-bold text-[#0A1628]">

                            {dumpster.title}

                          </p>

                        </td>

                        <td
                          className="p-2 sm:p-4"
                          align="center"
                        >

                          <div className="leading-5">

                            <div>
                              <span className="font-bold">
                                Length:
                              </span>{" "}
                              {size?.length_ft}'
                            </div>

                            <div>
                              <span className="font-bold">
                                Width:
                              </span>{" "}
                              {size?.width_ft}'
                            </div>

                            <div>
                              <span className="font-bold">
                                Height:
                              </span>{" "}
                              {size?.height_ft}'
                            </div>

                          </div>

                        </td>

                        <td className="p-2 sm:p-4">

                          {
                            dumpster.weight_capacity_text
                          }

                        </td>

                        <td className="p-2 sm:p-4">

                          <div className="font-bold">

                            {
                              dumpster.included_days
                            } Days

                          </div>

                          <div className="text-gray-500 text-[9px] sm:text-xs">

                            included before additional charges apply

                          </div>

                        </td>

                      </tr>

                    );

                  })}

              </tbody>

            </table>

          </div>

        </div>

      </section>



      {/* cards */}

      <section className="py-20">

        <div className="max-w-7xl mx-auto px-5">

          <div className="text-center mb-14">

            <h2 className="text-3xl lg:text-5xl font-black text-[#0A1628]">

              Our Roll-Off Dumpster Sizes

            </h2>

          </div>

          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">

            {dumpsters.map((dumpster: any) => (

              <div
                key={dumpster.id}
                className="
                                    rounded-3xl
                                    border-2
                                    border-blue-200
                                    bg-white
                                    shadow-lg
                                    hover:shadow-2xl
                                    transition-all
                                    duration-300
                                    flex
                                    flex-col
                                    overflow-hidden
                                    p-5 md:p-6
                                    h-full
                                    hover:-translate-y-2
                                "
              >

                <div className="relative w-full h-48 sm:h-56 flex justify-center mb-5">

                  <Image
                    src={getImage(dumpster)}
                    alt={dumpster.title}
                    fill
                    unoptimized
                    className="object-contain"
                  />

                </div>

                <h3 className="text-xl sm:text-2xl font-bold mb-3 text-cyan-900">

                  {dumpster.title}

                </h3>

                <p className="text-gray-600 text-sm sm:text-base mb-5 flex-grow">

                  {dumpster.short_description}

                </p>

                <Link
                  href={`/dumpsters/roll-off-dumpsters/${dumpster.slug}`}
                  className="
                                    mt-auto
                                    w-full
                                    py-3
                                    rounded-xl
                                    text-center
                                    font-semibold
                                    transition-all
                                    duration-300
                                    bg-cyan-600
                                    hover:bg-cyan-700
                                    text-white
                                    "
                >

                  More About This Dumpster

                </Link>

              </div>

            ))}

          </div>

        </div>

      </section>



      {/* AI CTA */}

      <section className="py-20 bg-[#0A1628]">

        <div className="max-w-5xl mx-auto text-center px-5">

          <div className="inline-flex rounded-full px-4 py-2 bg-[#FFD700]/10 text-[#FFD700] font-bold mb-5">

            <Bot className="w-4 h-4 mr-2" />

            AI Powered Recommendation

          </div>

          <h2 className="text-4xl font-black text-white">

            Need Help Choosing A Size?

          </h2>

          <p className="text-gray-300 mt-5">

            Use our AI recommendation tool and get matched with the ideal roll-off dumpster in seconds.

          </p>

          <Button
            asChild
            className="mt-10 bg-gradient-to-r from-[#B8860B] via-[#FFD700] to-[#DAA520] text-[#0A1628]"
          >

            <Link href="/dumpster-recommendation">

              Try AI Recommendation

            </Link>

          </Button>

        </div>

      </section>


      <RollOffFaq />

      <Footer />

    </main>

  );

}