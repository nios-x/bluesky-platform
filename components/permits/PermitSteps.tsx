import {
    Globe,
    Building2,
    Home,
    Phone,
} from "lucide-react";

const steps = [
    {
        title: "Search Government Website",
        icon: Globe
    },
    {
        title: "Contact Municipality",
        icon: Building2
    },
    {
        title: "Review HOA Rules",
        icon: Home
    },
    {
        title: "Call Bluesky",
        icon: Phone
    }
];

export default function PermitSteps() {

    return (

        <section className="bg-slate-50 py-20">

            <div className="max-w-7xl mx-auto px-6">

                <h2 className="text-4xl font-bold text-center">

                    How To Apply

                </h2>

                <div className="grid md:grid-cols-4 gap-8 mt-14">

                    {steps.map((step) => {

                        const Icon = step.icon;

                        return (

                            <div
                                key={step.title}
                                className="bg-white rounded-3xl p-8 text-center"
                            >

                                <div className="w-16 h-16 rounded-full bg-blue-50 flex mx-auto items-center justify-center">

                                    <Icon />

                                </div>

                                <h3 className="font-bold mt-5">

                                    {step.title}

                                </h3>

                            </div>

                        )

                    })}

                </div>

            </div>

        </section>

    )

}