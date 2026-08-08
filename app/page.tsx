'use client';

import Image from 'next/image';
import Link from 'next/link';
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
    <>
      {/* Zero-config custom animations for a polished load-in effect */}
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-up { 
          opacity: 0;
          animation: fadeUp 0.8s ease-out forwards; 
        }
        .delay-100 { animation-delay: 100ms; }
        .delay-200 { animation-delay: 200ms; }
      `}</style>

      <main className="relative min-h-screen overflow-hidden bg-slate-50 flex items-center">
        {/* Background Image with Gradient Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1581092160562-40aa08e78837?ixlib=rb-4.0.3&auto=format&fit=crop&w=2560&q=80"
            alt="Manufacturing facility background"
            className="h-full w-full object-cover object-center opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-100 via-slate-100/90 to-slate-100/40"></div>
        </div>

        <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col gap-16 px-6 py-16 lg:flex-row lg:items-center lg:justify-between lg:py-24">
          
          {/* Left Column: Hero Text */}
          <div className="space-y-8 lg:max-w-2xl animate-fade-up">
            <div>
              <span className="inline-flex items-center rounded-full border border-blue-200 bg-blue-50/50 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-blue-700 backdrop-blur-sm">
                NAFAM Toy Factory
              </span>
              <h1 className="mt-6 text-5xl font-extrabold tracking-tight text-slate-900 sm:text-6xl lg:text-7xl">
                Remove noise, <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-cyan-600">
                  surface truth.
                </span>
              </h1>
            </div>
            
            <p className="max-w-2xl text-lg leading-relaxed text-slate-600 sm:text-xl">
              Track machine status, cycle time, good vs. defective output, downtime reasons, and shift context with a single, precision-engineered dashboard.
            </p>
            
            <div className="flex flex-col gap-4 sm:flex-row">
              <Link 
                href="/login" 
                className="group inline-flex items-center justify-center rounded-xl bg-blue-700 px-8 py-4 text-base font-semibold text-white shadow-lg shadow-blue-700/20 transition-all duration-300 hover:-translate-y-0.5 hover:bg-blue-800 hover:shadow-blue-700/40"
              >
                Sign In
                <svg className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
              <Link 
                href="/dashboard" 
                className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white/80 px-8 py-4 text-base font-semibold text-slate-700 shadow-sm backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-slate-50 hover:text-slate-900 hover:shadow"
              >
                <svg className="mr-2 h-5 w-5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                View Demo Dashboard
              </Link>
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
          
        </section>
      </div>
      </main>
    </>
  );
}