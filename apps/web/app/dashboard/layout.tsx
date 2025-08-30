
"use client";

import { useSession } from 'next-auth/react';
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { useState } from 'react';
import { Circle } from 'lucide-react';

export default function DashboardLayout({ children }: { children: React.ReactNode; }) {
    const { data: session, status } = useSession();
    const [pageName, setpageName] = useState("Dashboard");
    console.log(session);

    if (status === "loading") return (
        <div className="flex items-center justify-center gap-2 border-b border-zinc-800/60 bg-gradient-to-b from-zinc-950 via-[#0B1220] to-black px-4 min-h-screen text-zinc-100">
            <h1 className="text-2xl font-medium text-white animate-spin"><Circle /></h1>
        </div>
    );

    return (
        <SidebarProvider>
            <AppSidebar setpageName={setpageName} />
            <SidebarInset>
                <div className="sticky top-0 z-40 flex h-[61px] items-center justify-between gap-2 border-b border-zinc-800/60 bg-gradient-to-r from-zinc-950 via-[#0B1220] to-zinc-950 px-4 text-zinc-100">
                    <div className='flex items-center gap-2'>
                        <SidebarTrigger className="text-zinc-300 hover:bg-white/5 focus-visible:ring-2 focus-visible:ring-white/10" />
                        <h1 className="text-sm font-medium text-zinc-100">{pageName}</h1>
                    </div>
                    {status === "authenticated" && session && (
                        <img src={session?.user.image || '/fallbackuser.png'} className='h-8.5 w-8.5 rounded-full bg-zinc-800 border border-zinc-700' title={session?.user.name as string}></img>
                    )}
                </div>
                <div className="p-4 h-full text-zinc-100 bg-gradient-to-b from-zinc-950 via-[#0B1220] to-black">{children}</div>
            </SidebarInset>
        </SidebarProvider>
    );
}