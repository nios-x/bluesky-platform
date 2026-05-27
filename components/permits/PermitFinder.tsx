export default function PermitFinder() {
    return (
        <section className="py-20">

            <div className="max-w-5xl mx-auto px-6">

                <div className="bg-[#0A1628] rounded-3xl p-10 text-center text-white">

                    <h2 className="text-4xl font-bold">

                        Find Permit Information Near You

                    </h2>

                    <p className="text-white/70 mt-4">

                        Search your city or county to view permit details.

                    </p>

                    <div className="flex gap-4 mt-8">

                        <input
                            placeholder="Enter city or ZIP code"
                            className="flex-1 h-14 rounded-xl px-5 text-black"
                        />

                        <button className="bg-[#FFD700] text-black px-8 rounded-xl">

                            Search

                        </button>

                    </div>

                </div>

            </div>

        </section>
    );
}