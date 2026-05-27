const faqs = [
    {
        q: "Do I need a permit for a dumpster?",
        a: "Permit requirements depend on local regulations and placement location."
    },
    {
        q: "Can I place a dumpster in the street?",
        a: "Street placement often requires approval from local authorities."
    },
    {
        q: "Who gets the permit?",
        a: "Responsibility varies by municipality and project."
    },
    {
        q: "Can permit approval delay delivery?",
        a: "Permit processing times vary by city."
    }
];

export default function PermitFaq() {

    return (

        <section className="bg-slate-50 py-20">

            <div className="max-w-5xl mx-auto px-6">

                <h2 className="text-4xl font-bold text-center">

                    Frequently Asked Questions

                </h2>

                <div className="space-y-6 mt-12">

                    {faqs.map((faq) => (

                        <div
                            key={faq.q}
                            className="bg-white p-6 rounded-2xl"
                        >

                            <h3 className="font-bold">

                                {faq.q}

                            </h3>

                            <p className="mt-3 text-slate-600">

                                {faq.a}

                            </p>

                        </div>

                    ))}

                </div>

            </div>

        </section>

    )

}