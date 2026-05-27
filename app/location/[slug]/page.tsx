import { Metadata } from "next";
import Link from "next/link";
import {
  ChevronRight,
  Phone,
  Bot,
  ArrowRight,
  MapPin,
  Shield,
  Truck,
  DollarSign,
  Calendar,
  Package
} from "lucide-react";

import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

import DumpsterSize from "@/components/home/dumpster-size";
import HowItWorks from "@/components/home/how-it-works";
import LocationFaq from "./LocationFaq";
import { getLocationBySlug } from "@/lib/location-data";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata(
  { params }: Props
): Promise<Metadata> {

  const { slug } = await params;

  const data = await getLocationBySlug(slug);

  if (!data) {
    return {
      title: "Location Not Found"
    };
  }

  return {
    title: `Budget Dumpster Rental in ${data.city} | Affordable Dumpster Services`,
    description: `Looking for affordable dumpster rental in ${data.city}? Get budget-friendly dumpsters for residential, construction, and junk removal projects. Fast delivery and easy pickup.`,
  };
}

export default async function Page(
  { params }: Props
) {

  const { slug } = await params;

  const data = await getLocationBySlug(slug);

  if (!data) return null;

  const {
    city,
    county,
    state,
    nearbyCounties
  } = data;

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

            <Link
              href="/location"
              className="hover:text-[#0A1628]"
            >
              Location
            </Link>

            <ChevronRight className="h-4 w-4 mx-2" />

            <span className="font-medium text-[#0A1628]">

              {county}

            </span>

          </div>

        </div>

      </section>


      {/* HERO */}

      <section className="relative overflow-hidden bg-gradient-to-r from-[#0A1628] via-[#183867] to-[#0A1628] ">

        <div className=" max-w-7xl mx-auto px-5 py-12 md:py-20 ">

          <div className=" max-w-4xl mx-auto text-center ">

            <div className=" inline-flex items-center rounded-full px-4 py-2 bg-white/10 text-white mb-6 ">        
                 <MapPin size={16} className="mr-2" />

                  {county}, {state}

            </div>

            <h1 className=" text-4xl md:text-6xl font-black text-white leading-tight mb-8 " >
              Rent a Dumpster in
              <br />

              {county}

            </h1>

            <div className=" mt-8 text-lg text-white/85 leading-8 space-y-4 max-w-3xl mx-auto ">

              <p>
                Simplify waste disposal with dependable dumpster rental services from Blue Sky Disposal. We provide affordable rubber-wheeled, permanent, and roll-off dumpster rental in {county} for homeowners, contractors, businesses, and construction sites. Whether you are renovating a home, clearing out junk, or managing construction debris, we have the right dumpster size for your needs.
              </p>

              <p>
                Our rentals include same-day service, scheduled pickup, flexible rental periods, and straightforward pricing. Get reliable dumpster rental service in {county} from Blue Sky Disposal, your trusted local dumpster company. Check pricing online or contact our team today. We provide customer service day and night.

              </p>

              <p>
                Blue Sky Disposal gives utmost importance to ethical waste disposal. We are one of the most environmentally-conscious commercial and residential dumpster rental services in {county}. We collaborate with recycling facilities and transfer stations to guarantee ethical waste disposal.
              </p>

            </div>


            {/* BOOKING */}

            <div className=" mt-10 max-w-2xl mx-auto bg-white rounded-2xl p-3 shadow-2xl ">

              <div className=" flex items-center ">

                <input
                  placeholder="Enter ZIP Code"
                  className=" flex-1 px-4 py-4 outline-none text-black "

                />

                <button
                  className="
                    bg-[#C89B2B]
                    px-8
                    py-4
                    rounded-xl
                    font-bold
                    text-white
                    hover:scale-105
                    transition
                    "
                >

                  Check Pricing

                </button>

              </div>

            </div>

          </div>

        </div>

      </section>


      {/* CHOOSE DUMPSTER */}

      <section
        id="choose"
        className="py-20 bg-[#F8FAFC]"
      >

        <div className="max-w-7xl mx-auto px-5">

          <DumpsterSize />

        </div>

      </section>


      {/* BUDGET SECTION */}

      <section className="py-20">

        <div className="max-w-5xl mx-auto px-5 text-center">

          <h2 className="
          text-4xl
          font-black
          text-[#0A1628]
          mb-8
          ">

            Budget-Friendly Dumpster Rentals
            <br />
            in {county}

          </h2>

          <p className="
          text-gray-500
          leading-8
          text-lg
          ">

            Blue Sky Disposal offers a strict, transparent pricing policy. Customer satisfaction is at the heart of all we do. When you rent a dumpster in {county} with us, you do not have to worry about any hidden fees. Our flexible rental periods make our dumpster rental service ideal for homeowners, contractors, businesses, and construction sites.


          </p>

          <a
            href="#choose"
            className="
            mt-10
            inline-flex
            items-center
            gap-3
            bg-[#C89B2B]
            text-white
            px-8
            py-4
            rounded-xl
            font-bold
            hover:scale-105
            transition
            "
          >

            Rent a Dumpster Now

            <ArrowRight />

          </a>

        </div>

      </section>

      {/* SECTION 5: PERMIT INFORMATION */} 
      <section className="py-20"> 
        <div className=" max-w-5xl mx-auto px-5 "> 
          <div className=" border-l-4 border-[#DAA520] rounded-3xl bg-yellow-50 p-8 "> 
            <h2 className=" text-3xl font-black mb-4 text-[#0A1628] "> Permit Information </h2> 
            <p className=" text-slate-600 leading-8 text-base " > Permits are usually not required on private property. Street placement may require approval depending on municipality rules. </p> 
            </div> 
          </div> 
        </section> 
        
      {/* SECTION 6: NEARBY LOCATIONS */}

      <section className="py-20 bg-[#F8FAFC]">

        <div className="max-w-7xl mx-auto px-5 text-center">

          <h2
            className="
      text-4xl
      font-black
      mb-5
      text-[#0A1628]
      "
          >

            Dumpster Rental Near {county}

          </h2>

          <p className="
    text-gray-500
    max-w-2xl
    mx-auto
    mb-10
    ">

            Explore nearby service areas and check dumpster
            rental availability across surrounding counties.

          </p>

          <div className="
    flex
    flex-wrap
    justify-center
    gap-4
    ">

            {nearbyCounties
              .filter(
                (x: string) =>
                  x !== county
              )
              .map(
                (x: string) => {

                  const slug = x
                    .replace(" County", "")
                    .toLowerCase()
                    .replace(/\s+/g, "-");

                  return (

                    <Link
                      key={x}
                      href={`/location/${slug}`}
                      className="
                px-6
                py-4
                bg-white
                rounded-2xl
                border
                hover:-translate-y-1
                hover:shadow-lg
                hover:bg-blue-50
                transition-all
                duration-300
                text-[#0A1628]
                font-semibold
                "
                    >

                      {x}

                    </Link>

                  );

                }
              )}

          </div>

        </div>

      </section>


      {/* WHY CHOOSE US */}

      <section className="py-20 bg-[#F8FAFC]">

        <div className="max-w-7xl mx-auto px-5">

          <h2 className="
          text-center
          text-4xl
          font-black
          mb-6
          text-[#0A1628]
          ">

            Why Customers in {county} Choose Us

          </h2>

          <p className="
          text-center
          text-gray-500
          text-lg
          leading-8
          max-w-3xl
          mx-auto
          mb-14
          ">

            Blue Sky is a name that homeowners, businesses, and contractors in {county} trust for dumpster rentals. We have been consistently among the best dumpster providers in {county} for the last many years. Here are some factors that make us reliable.
          </p>

          <div className="
          grid
          md:grid-cols-3
          gap-8
          ">

            {[
              { icon: <Truck />, title: "Fast delivery" },
              { icon: <Phone />, title: "Local support" },
              { icon: <DollarSign />, title: "Affordable pricing" },
              { icon: <Calendar />, title: "Easy scheduling" },
              { icon: <Package />, title: "Multiple dumpster sizes" },
              { icon: <Shield />, title: "Reliable pickup" }

            ].map((x) => (

              <div
                key={x.title}
                className="
                rounded-3xl
                border
                bg-white
                p-8
                text-center
                hover:-translate-y-2
                hover:shadow-2xl
                transition-all
                "
              >

                <div className="
                text-[#C89B2B]
                flex
                justify-center
                mb-4
                ">

                  {x.icon}

                </div>

                <h3 className="
                font-bold
                text-[#0A1628]
                ">

                  {x.title}

                </h3>

              </div>

            ))}

          </div>

        </div>

      </section>


      <HowItWorks />

      <LocationFaq
        county={county}
        city={county}
      />


      {/* FINAL CTA */}

      <section className="px-5 pb-20">

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

            <h2 className="
            text-white
            text-3xl
            md:text-5xl
            font-black
            ">

              Book Your Dumpster Rental
              <br />

              in {county}

            </h2>

            <p className="
            text-white/80
            mt-5
            ">

              Rent affordable dumpsters in {county}

            </p>

            <div className="
            flex
            flex-col
            sm:flex-row
            justify-center
            gap-4
            mt-8
            ">

              <a
                href="tel:5864123762"
                className="
                bg-[#C89B2B]
                px-8
                py-4
                rounded-xl
                font-bold
                text-white
                hover:scale-105
                transition
                "
              >

                Call Now

              </a>

              <Link
                href="/contact"
                className="
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
                "
              >

                Contact Us

              </Link>

            </div>

          </div>

        </div>

      </section>
      <Footer />

    </main>

  );

}