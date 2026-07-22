export default function Dashboard() {
    return (
        <main className="min-h-screen bg-gray-100 p-8">

            {/* Header */}

            <div className="mb-10">

                <h1 className="text-5xl font-black text-blue-900">
                    NAFAM Toy Factory
                </h1>

                <p className="text-gray-500 text-lg">
                    Building Better Toys Every Day
                </p>

            </div>


            {/* Welcome Message */}

            <div className="bg-white p-6 rounded-2xl shadow-lg mb-8">

                <h2 className="text-3xl font-bold">
                    Welcome Back!
                </h2>

                <p className="text-gray-500 mt-2">
                    Here is todays factory performance overview.
                </p>

            </div>



            {/* Statistics Cards */}

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">

                <div className="bg-white p-6 rounded-xl shadow-lg">

                    <h3 className="font-semibold">
                        Total Production
                    </h3>

                    <p className="text-4xl font-bold mt-3">
                        1450
                    </p>

                    <p>Toys Produced</p>

                </div>



                <div className="bg-white p-6 rounded-xl shadow-lg">

                    <h3 className="font-semibold">
                        Active Machines
                    </h3>

                    <p className="text-4xl font-bold mt-3">
                        24
                    </p>

                    <p>Machines Running</p>

                </div>



                <div className="bg-white p-6 rounded-xl shadow-lg">

                    <h3 className="font-semibold">
                        Efficiency
                    </h3>

                    <p className="text-4xl font-bold mt-3">
                        96%
                    </p>

                    <p>Production Efficiency</p>

                </div>



                <div className="bg-white p-6 rounded-xl shadow-lg">

                    <h3 className="font-semibold">
                        Quality Score
                    </h3>

                    <p className="text-4xl font-bold mt-3">
                        98%
                    </p>

                    <p>Factory Quality</p>

                </div>

            </div>




            {/* Factory Status */}

            <div className="bg-white p-6 rounded-2xl shadow-lg mt-8">

                <h2 className="text-2xl font-bold mb-4">

                    Factory Status

                </h2>

                <p className="text-green-600 font-bold text-xl">

                    ● Operational

                </p>

            </div>




            {/* Production Progress */}

            <div className="bg-white p-6 rounded-2xl shadow-lg mt-8">

                <h2 className="text-2xl font-bold">

                    Todays Production Target

                </h2>


                <p className="mt-4">

                    1450 / 2000 Toys Produced

                </p>


                <div className="w-full bg-gray-300 rounded-full h-5 mt-4">

                    <div
                        className="bg-blue-900 h-5 rounded-full"
                        style={{ width: "75%" }}
                    ></div>

                </div>

            </div>




            {/* Notifications */}

            <div className="bg-white p-6 rounded-2xl shadow-lg mt-8">

                <h2 className="text-2xl font-bold mb-5">

                    Recent Activities

                </h2>

                <ul className="space-y-3">

                    <li>
                        ✓ Production line synchronized successfully.
                    </li>

                    <li>
                        ✓ Machine 04 operating normally.
                    </li>

                    <li>
                        ✓ Production target is on track.
                    </li>

                    <li>
                        ✓ Quality standards maintained.
                    </li>

                </ul>

            </div>




            {/* Quick Access */}

            <div className="bg-white p-6 rounded-2xl shadow-lg mt-8">

                <h2 className="text-2xl font-bold mb-5">

                    Quick Access

                </h2>


                <div className="grid md:grid-cols-2 gap-4">

                    <button className="bg-blue-900 text-white p-4 rounded-xl">

                        Production Monitoring

                    </button>


                    <button className="bg-blue-900 text-white p-4 rounded-xl">

                        Machine Analytics

                    </button>


                    <button className="bg-blue-900 text-white p-4 rounded-xl">

                        Notifications

                    </button>


                    <button className="bg-blue-900 text-white p-4 rounded-xl">

                        Efficiency Reports

                    </button>

                </div>

            </div>

        </main>
    );
}