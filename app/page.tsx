'use client';

import Image from 'next/image';
import { type SyntheticEvent, useState } from 'react';

const BACKEND_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL ?? 'http://localhost:8080';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [statusMessage, setStatusMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const submitButtonLabel = loading ? 'Please wait...' : mode === 'signin' ? 'Sign In' : 'Sign Up';

  const handleSubmit = async (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatusMessage('');
    setErrorMessage('');

    if (!email || !password) {
      setErrorMessage('Please enter both email and password.');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${BACKEND_BASE_URL}/api/auth/${mode}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          password,
          ...(mode === 'signup' ? { role: 'OPERATOR' } : {}),
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        setErrorMessage(
          typeof data === 'string'
            ? data
            : data?.message || 'Auth failed. Check credentials and try again.'
        );
      } else if (mode === 'signup') {
        setStatusMessage('Account created successfully. Please sign in.');
        setMode('signin');
        setPassword('');
      } else {
        setStatusMessage(`Signed in successfully as ${data?.email || email}.`);
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unable to reach the backend. Is it running on http://localhost:8080?';
      setErrorMessage(message);
    } finally {
      setLoading(false);
    }
  }



  


  return (
    <main className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8 flex items-center justify-center">
      <div className="w-full max-w-5xl overflow-hidden rounded-2xl bg-white shadow-2xl grid md:grid-cols-2">
        {/* Left Section */}
        <section className="flex flex-col justify-center bg-blue-900 p-8 sm:p-10 text-white">
          <div className="mb-6 flex items-center gap-2">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white p-1 shadow-lg">
              <Image src="/nafam-logo.svg" alt="NAFAM logo" width={56} height={56} className="rounded-xl" />
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

          <form onSubmit={handleSubmit}>
            <label htmlFor="email" className="mb-2 block font-medium text-gray-700">Email Address</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Enter your email"
              className="mb-5 w-full rounded-lg border border-gray-300 p-3 outline-none focus:ring-2 focus:ring-blue-500"
            />

            <label htmlFor="password" className="mb-2 block font-medium text-gray-700">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Enter your password"
              className="mb-5 w-full rounded-lg border border-gray-300 p-3 outline-none focus:ring-2 focus:ring-blue-500"
            />

            <div className="mb-6 flex items-center gap-2">
              <input type="checkbox" id="remember" className="h-4 w-4 rounded border-gray-300 text-blue-900 focus:ring-blue-500" />
              <label htmlFor="remember" className="text-gray-600">Remember Me</label>
            </div>

            {errorMessage ? (
              <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{errorMessage}</div>
            ) : null}

            {statusMessage ? (
              <div className="mb-4 rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-700">{statusMessage}</div>
            ) : null}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-blue-900 py-3 text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitButtonLabel}
            </button>
          </form>

          <button
            type="button"
            onClick={() => {
              setMode(mode === 'signin' ? 'signup' : 'signin');
              setStatusMessage('');
              setErrorMessage('');
            }}
            className="mt-3 w-full rounded-lg border border-blue-900 py-3 text-blue-900 transition hover:bg-blue-50"
          >
            {mode === 'signin' ? 'Create a new account' : 'Already have an account? Sign In'}
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





























       