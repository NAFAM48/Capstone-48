import Link from "next/link";

export default function SignupPage() {
  return (
    <main className="min-h-screen bg-slate-100 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-2xl rounded-3xl bg-white p-8 shadow-lg text-center">
        <p className="text-sm uppercase tracking-[0.3em] text-slate-500">NAFAM OEE Control</p>
        <h1 className="mt-3 text-4xl font-bold text-slate-900">Sign Up</h1>
        <p className="mt-2 text-slate-600">This demo app uses fixed demo users. Please sign in with one of the accounts shown on the login page.</p>
        <div className="mt-8 rounded-3xl border border-slate-200 bg-slate-50 p-6 text-left">
          <p className="font-semibold text-slate-900">Demo account list</p>
          <ul className="mt-4 space-y-2 text-slate-700">
            <li>Admin: admin@nafam.com / demo</li>
            <li>Plant Manager: manager@nafam.com / demo</li>
            <li>Viewer: viewer@nafam.com / demo</li>
          </ul>
        </div>
        <Link href="/login" className="mt-8 inline-flex rounded-2xl bg-blue-900 px-6 py-3 text-white transition hover:bg-blue-800">
          Back to Login
        </Link>
      </div>
    </main>
  );
}
