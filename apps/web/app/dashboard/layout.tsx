
"use client";

import { useSession } from 'next-auth/react';
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { useState } from 'react';
import { Circle } from 'lucide-react';

export default function DashboardLayout({ children }: { children: React.ReactNode; }) {
    const { data: session, status } = useSession();
    const [pageName, setpageName] = useState("Dashboard");

    if (status === "loading") return (
        <div className="flex items-center justify-center gap-2 border-b border-gray-800 bg-gray-900 px-4 min-h-screen">
            <h1 className="text-2xl font-medium text-white animate-spin"><Circle /></h1>
        </div>
    );

    return (
        <SidebarProvider>
            <AppSidebar setpageName={setpageName} />
            <SidebarInset>
                <div className="flex h-12 items-center justify-between gap-2 border-b border-gray-800 bg-gray-900 px-4">
                    <div className='flex items-center gap-2'>
                        <SidebarTrigger />
                        <h1 className="text-sm font-medium text-white">{pageName}</h1>
                    </div>
                    {status === "authenticated" && session && (
                        <img src={session?.user.image || '/fallbackuser.png'} className='h-8.5 w-8.5 rounded-full bg-gray-800 border-slate-500 border' title={session?.user.name as string}></img>
                    )}
                </div>
                <div className="p-4 bg-gray-900 text-white h-screen">{children}</div>
            </SidebarInset>
        </SidebarProvider>
    );
}