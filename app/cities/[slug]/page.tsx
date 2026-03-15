import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { notFound } from "next/navigation";

const cityData: Record<string, { name: string; description: string }> = {
  detroit: {
    name: "Detroit",
    description: "Service details, local rules, and permit guidance for Detroit."
  },
  warren: {
    name: "Warren",
    description: "Service details, local rules, and permit guidance for Warren."
  },
  "sterling-heights": {
    name: "Sterling Heights",
    description: "Service details, local rules, and permit guidance for Sterling Heights."
  },
  livonia: {
    name: "Livonia",
    description: "Service details, local rules, and permit guidance for Livonia."
  },
  troy: {
    name: "Troy",
    description: "Service details, local rules, and permit guidance for Troy."
  },
  dearborn: {
    name: "Dearborn",
    description: "Service details, local rules, and permit guidance for Dearborn."
  }
};

export default async function CityPage({ params }: { params: { slug: string } }) {
  const resolvedParams = await params;
  const city = cityData[resolvedParams.slug];

  if (!city) {
    notFound();
  }

  return (
    <main className="bg-white">
      <Header />
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">{city.name}</h1>
          <p className="text-slate-600 mb-8">{city.description}</p>

          <div className="grid gap-6">
            <div className="border border-slate-200 rounded-2xl p-6">
              <h2 className="text-xl font-semibold mb-2">Service Details</h2>
              <p className="text-slate-600">Availability, delivery windows, and local coverage will be listed here.</p>
            </div>

            <div className="border border-slate-200 rounded-2xl p-6">
              <h2 className="text-xl font-semibold mb-2">Permits & Local Rules</h2>
              <p className="text-slate-600">Street placement requirements and permit guidance will be listed here.</p>
            </div>

            <div className="border border-slate-200 rounded-2xl p-6">
              <h2 className="text-xl font-semibold mb-2">Allowed Materials</h2>
              <p className="text-slate-600">Allowed and prohibited materials for this city will be listed here.</p>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
