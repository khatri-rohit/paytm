"use client";

import { useSession } from 'next-auth/react';
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { useState } from 'react';
import { Circle } from 'lucide-react';
import { Toaster } from '@/components/ui/sonner';

export default function DashboardLayout({ children }: { children: React.ReactNode; }) {
    const { data: session, status } = useSession();
    const [pageName, setpageName] = useState("Dashboard");

    if (status === "loading") return (
        <div className="flex items-center justify-center gap-2 border-b border-zinc-800/60 bg-gradient-to-b from-zinc-950 via-[#0B1220] to-black px-4 min-h-screen text-zinc-100">
            <h1 className="text-2xl font-medium text-white animate-spin"><Circle /></h1>
        </div>
    );

    return (
        <SidebarProvider>
            <AppSidebar setpageName={setpageName} />
            <SidebarInset>
                {/* Responsive Header */}
                <div className="sticky top-0 z-40 flex h-14 sm:h-16 items-center justify-between gap-2 border-b border-zinc-800/60 bg-gradient-to-r from-zinc-950 via-[#0B1220] to-zinc-950 px-3 sm:px-4 text-zinc-100">
                    <div className='flex items-center gap-2 min-w-0'>
                        <SidebarTrigger className="text-zinc-300 hover:bg-white/5 focus-visible:ring-2 focus-visible:ring-white/10" />
                        <h1 className="text-sm sm:text-base font-medium text-zinc-100 truncate">{pageName}</h1>
                    </div>
                    {status === "authenticated" && session && (
                        <div className="flex items-center gap-2 sm:gap-3">
                            {/* Optional: User name on larger screens */}
                            <span className="hidden md:inline text-sm text-zinc-300 truncate max-w-32">
                                {session?.user.name}
                            </span>
                            <img
                                src={session?.user.image || '/fallbackuser.png'}
                                className='h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-zinc-800 border border-zinc-700 flex-shrink-0'
                                title={session?.user.name as string}
                                alt="User avatar"
                            />
                        </div>
                    )}
                </div>

                {/* Responsive Content */}
                <div className="p-3 sm:p-4 lg:p-6 h-full text-zinc-100 bg-gradient-to-b from-zinc-950 via-[#0B1220] to-black overflow-auto">
                    {children}
                </div>
                <Toaster position='top-center' />
            </SidebarInset>
        </SidebarProvider>
    );
}