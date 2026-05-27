//app/dumpster-permits/page.tsx

import PermitHero from "@/components/permits/PermitHero";
import PermitNames from "@/components/permits/PermitNames";
import PermitSteps from "@/components/permits/PermitSteps";
import PermitFinder from "@/components/permits/PermitFinder";
import PermitFaq from "@/components/permits/PermitFaq";
import PermitCTA from "@/components/permits/PermitCTA";

export const metadata = {
    title:
        "Dumpster Permits | Bluesky Disposal",

    description:
        "Learn when dumpster permits may be required, where to apply and how to avoid project delays.",
};

export default function DumpsterPermitsPage() {
    return (
        <main className="overflow-hidden">

            <PermitHero />

            <PermitNames />

            <PermitSteps />

            <PermitFinder />

            <PermitFaq />

            <PermitCTA />

        </main>
    );
}