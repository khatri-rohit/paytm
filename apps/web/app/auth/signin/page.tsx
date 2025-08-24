'use client';

import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { useState } from 'react';

export default function SignIn() {
  const [form, setForm] = useState({
    number: '',
    password: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Sign In Data:', form);
    const res = await signIn('signin', {
      password: form.password,
      number: form.number,
      callbackUrl: '/dashboard'
    });
    console.log(res);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 text-black">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Sign In</h2>

        <div className="mb-4">
          <label className="block mb-1 font-medium">Number</label>
          <input
            type="text"
            name="number"
            value={form.number}
            onChange={handleChange}
            className="w-full border border-gray-300 px-4 py-2 rounded"
            placeholder="Enter your number"
            required
          />
        </div>

        <div className="mb-6">
          <label className="block mb-1 font-medium">Password</label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            className="w-full border border-gray-300 px-4 py-2 rounded"
            placeholder="Enter your password"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Sign In
        </button>

        <p className="mt-4 text-center">
          Don’t have an account?{' '}
          <Link href="/auth/signup" className="text-blue-600 hover:underline">
            Create New Account
          </Link>
        </p>
      </form>
    </div>
  );
}
