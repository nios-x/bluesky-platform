const permitNames = [
    "Street Use Permit",
    "Temporary Use Permit",
    "Lane Closure Permit",
    "Right-of-Way Permit",
    "Encroachment Permit",
    "Dumpster Placement Permit",
];

export default function PermitNames() {
    return (
        <section className="py-20">

            <div className="max-w-7xl mx-auto px-6">

                <div className="grid lg:grid-cols-2 gap-14">

                    <div>

                        <h2 className="text-4xl font-bold">

                            What Is a Dumpster Permit?

                        </h2>

                        <p className="mt-6 text-slate-600 leading-8">

                            A dumpster permit is approval issued by local authorities for temporary placement of a dumpster in certain locations.

                        </p>

                    </div>

                    <div className="grid grid-cols-2 gap-4">

                        {permitNames.map(
                            (item) => (
                                <div
                                    key={item}
                                    className="rounded-2xl border p-5 hover:shadow-lg transition"
                                >
                                    {item}
                                </div>
                            )
                        )}

                    </div>

                </div>

            </div>

        </section>
    );
}