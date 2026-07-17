"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function LoadingPage() {

    const router = useRouter();

    const [progress, setProgress] = useState(0);


    useEffect(() => {

        const timer = setInterval(() => {

            setProgress((prev) => {

                if (prev >= 100) {

                    clearInterval(timer);

                    router.push("/dashboard");

                    return 100;
                }

                return prev + 5;

            });

        }, 200);


        return () => clearInterval(timer);

    }, [router]);



    return (

        <main className="min-h-screen flex items-center justify-center bg-gray-100">

            <div className="bg-white shadow-2xl rounded-2xl p-12 w-[700px] text-center">


                <h1 className="text-5xl font-black text-blue-900">

                    PlayForge

                </h1>


                <p className="text-gray-500 tracking-[0.3em] mb-8">

                    INDUSTRIES

                </p>


                <h2 className="text-2xl font-semibold mb-6">

                    Initializing Factory Systems

                </h2>


                <p className="text-xl mb-5">

                    {progress}%

                </p>



                {/* Progress Bar */}

                <div className="w-full bg-gray-300 rounded-full h-5 mb-8">

                    <div
                        className="bg-blue-900 h-5 rounded-full duration-300"
                        style={{ width: `${progress}%` }}
                    >

                    </div>

                </div>



                <div className="space-y-3 text-gray-600">

                    <p>
                        Filtering Production Noise...
                    </p>

                    <p>
                        Preparing Efficiency Analytics...
                    </p>

                    <p>
                        Synchronizing Machine Data...
                    </p>

                </div>


                <p className="mt-8 text-sm text-gray-500">

                    Please wait while the system prepares your dashboard.

                </p>


            </div>

        </main>

    );
}