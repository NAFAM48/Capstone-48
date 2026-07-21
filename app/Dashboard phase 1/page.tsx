export default function Dashboard() {
    return (

        <main className="min-h-screen bg-gray-100 p-10">

            <h1 className="text-5xl font-black text-blue-900">

                NAFAM Toy Factory Dashboard

            </h1>

            <p className="text-gray-500 mb-10">

                Toy Manufacturing Analytics Dashboard

            </p>


            <div className="grid grid-cols-2 gap-6">

                <div className="bg-white p-6 rounded-xl shadow-lg">

                    <h2 className="text-xl font-bold">

                        Production Today

                    </h2>

                    <p className="text-4xl mt-4">

                        1450

                    </p>

                    <p>Toys Produced</p>

                </div>


                <div className="bg-white p-6 rounded-xl shadow-lg">

                    <h2 className="text-xl font-bold">

                        Active Machines

                    </h2>

                    <p className="text-4xl mt-4">

                        24

                    </p>

                    <p>Machines Running</p>

                </div>



                <div className="bg-white p-6 rounded-xl shadow-lg">

                    <h2 className="text-xl font-bold">

                        Production Efficiency

                    </h2>

                    <p className="text-4xl mt-4">

                        96%

                    </p>

                </div>



                <div className="bg-white p-6 rounded-xl shadow-lg">

                    <h2 className="text-xl font-bold">

                        Production Noise

                    </h2>

                    <p className="text-4xl mt-4">

                        LOW

                    </p>

                </div>


            </div>


            <div className="bg-white p-8 rounded-xl shadow-lg mt-10">

                <h2 className="text-2xl font-bold">

                    Todays Overview

                </h2>


                <ul className="mt-5 space-y-3">

                    <li>Production Target Achieved.</li>

                    <li>Quality Score: 98%</li>

                    <li>Factory Status: Operational.</li>

                    <li>Energy Consumption: Normal.</li>

                </ul>

            </div>


        </main>

    );
}