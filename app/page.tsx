import Image from 'next/image';

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8 flex items-center justify-center">
      <div className="w-full max-w-5xl overflow-hidden rounded-2xl bg-white shadow-2xl grid md:grid-cols-2">
        {/* Left Section */}
        <section className="flex flex-col justify-center bg-blue-900 p-8 sm:p-10 text-white">
          <div className="mb-6 flex items-center gap-2">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white p-1 shadow-lg">
              <svg viewBox="0 0 64 64" className="h-14 w-14" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="32" cy="32" r="28" fill="#F8FAFC"/>
                <path d="M20 24C20 20.6863 22.6863 18 26 18H38C41.3137 18 44 20.6863 44 24V28H20V24Z" fill="#1D4ED8"/>
                <path d="M20 28H44V40C44 42.2091 42.2091 44 40 44H24C21.7909 44 20 42.2091 20 40V28Z" fill="#2563EB"/>
                <path d="M24 32H40" stroke="#F8FAFC" strokeWidth="3" strokeLinecap="round"/>
                <path d="M26 20L24 44" stroke="#1E3A8A" strokeWidth="3" strokeLinecap="round"/>
                <path d="M38 20L40 44" stroke="#1E3A8A" strokeWidth="3" strokeLinecap="round"/>
                <path d="M20 28L16 24" stroke="#1E3A8A" strokeWidth="3" strokeLinecap="round"/>
                <path d="M44 28L48 24" stroke="#1E3A8A" strokeWidth="3" strokeLinecap="round"/>
                <circle cx="24" cy="36" r="2" fill="#F8FAFC"/>
                <circle cx="40" cy="36" r="2" fill="#F8FAFC"/>
              </svg>
            </div>
            <div className="flex flex-col justify-center">
              <h1 className="-ml-1 text-[1.7rem] font-black tracking-[0.2em] text-white">NAFAM</h1>
              <p className="-mt-1 text-sm font-semibold uppercase tracking-[0.28em] text-blue-100">Toy Factory</p>
            </div>
          </div>

          <h2 className="mb-6 text-2xl">Monitoring System</h2>

          <div className="space-y-2 text-lg">
            <p>Building Better Toys Everyday</p>
            <p>Production Lines</p>
            <p>Quality Monitoring</p>
            <p>Machine Analytics</p>
            <p>Factory Performance</p>
          </div>
        </section>

        {/* Right Section */}
        <section className="p-8 sm:p-10">
          <h2 className="mb-2 text-3xl font-bold text-gray-900">Welcome Back</h2>
          <p className="mb-8 text-gray-500">Please login to continue or create a new account.</p>

          <label className="mb-2 block font-medium text-gray-700">Email Address</label>
          <input
            type="email"
            placeholder="Enter your email"
            className="mb-5 w-full rounded-lg border border-gray-300 p-3 outline-none focus:ring-2 focus:ring-blue-500"
          />

          <label className="mb-2 block font-medium text-gray-700">Password</label>
          <input
            type="password"
            placeholder="Enter your password"
            className="mb-5 w-full rounded-lg border border-gray-300 p-3 outline-none focus:ring-2 focus:ring-blue-500"
          />

          <div className="mb-6 flex items-center gap-2">
            <input type="checkbox" />
            <p className="text-gray-600">Remember Me</p>
          </div>

          <button className="w-full rounded-lg bg-blue-900 py-3 text-white transition hover:bg-blue-700">
            Sign In
          </button>

          <button className="mt-3 w-full rounded-lg border border-blue-900 py-3 text-blue-900 transition hover:bg-blue-50">
            Sign Up
          </button>

          <div className="mt-4 flex flex-col gap-3">
            <button className="flex items-center justify-center gap-3 rounded-lg border border-gray-200 py-3 text-gray-700 transition hover:bg-gray-50">
              <div className="flex h-5 w-5 items-center justify-center">
                <Image src="/google-logo.svg" alt="Google logo" width={18} height={18} />
              </div>
              <span>Continue with Google</span>
            </button>

            <button className="flex items-center justify-center gap-3 rounded-lg border border-gray-200 py-3 text-gray-700 transition hover:bg-gray-50">
              <div className="flex h-5 w-5 items-center justify-center">
                <Image src="/apple-logo.svg" alt="Apple logo" width={18} height={18} />
              </div>
              <span>Continue with Apple</span>
            </button>
          </div>

          <p className="mt-6 text-center text-sm text-gray-500">
            By signing in with an account, you agree to our{' '}
            <span className="font-medium text-gray-700">Terms of Service</span> and{' '}
            <span className="font-medium text-gray-700">Privacy Policy</span>
          </p>
        </section>
      </div>
    </main>
  );
}




























       