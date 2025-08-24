'use client';

import Link from 'next/link';
import { useState } from 'react';
import { signIn } from 'next-auth/react';

export default function SignUp() {
    const [form, setForm] = useState({
        name: '',
        email: '',
        number: '',
        password: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Sign Up Data:', form);
        const res = await signIn('signup', {
            email: form.email,
            password: form.password,
            name: form.name,
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
                <h2 className="text-2xl font-bold mb-6 text-center">Sign Up</h2>

                <div className="mb-4">
                    <label className="block mb-1 font-medium">Name</label>
                    <input
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        className="w-full border border-gray-300 px-4 py-2 rounded"
                        placeholder="Enter your name"
                        required
                    />
                </div>

                <div className="mb-4">
                    <label className="block mb-1 font-medium">Email</label>
                    <input
                        type="text"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        className="w-full border border-gray-300 px-4 py-2 rounded"
                        placeholder="Enter your email"
                        required
                    />
                </div>

                <div className="mb-4">
                    <label className="block mb-1 font-medium">Number</label>
                    <input
                        type="text"
                        name="number"
                        value={form.number}
                        onChange={handleChange}
                        className="w-full border border-gray-300 px-4 py-2 rounded"
                        placeholder="Enter your phone number"
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
                    className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
                >
                    Sign Up
                </button>

                <p className="mt-4 text-center">
                    Already have an account?{' '}
                    <Link href="/auth/signin" className="text-blue-600 hover:underline">
                        Sign In
                    </Link>
                </p>
            </form>
        </div>
    );
}
