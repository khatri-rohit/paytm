"use client";

import { signOut, useSession } from 'next-auth/react';
import { Dispatch, SetStateAction } from 'react';
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Banknote, Users, Wallet2 } from "lucide-react";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";

export function AppSidebar({ setpageName }: { setpageName: Dispatch<SetStateAction<string>>; }) {
    const pathname = usePathname();

    const { data: session, status } = useSession();

    const isActive = (href: string) => {
        if (href === "/dashboard") return pathname === "/dashboard";
        return pathname?.startsWith(href);
    };

    const handleMenuItemClick = (name: string) => {
        setpageName(name);
    };

    return (
        <Sidebar className="bg-gradient-to-b from-zinc-950 via-[#0B1220] to-black border-r border-zinc-800/60 text-zinc-100 [&_[data-sidebar=sidebar]]:bg-transparent [&_[data-sidebar=header]]:bg-transparent [&_[data-sidebar=content]]:bg-transparent [&_[data-sidebar=footer]]:bg-transparent">
            <SidebarHeader className="bg-transparent border-b border-zinc-800/60">
                <div className="px-3 py-2">
                    <Link href="/dashboard" className="flex items-center gap-2">
                        <span className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-gradient-to-br from-sky-500/15 to-indigo-500/15 ring-1 ring-inset ring-zinc-700">
                            <Wallet2 className="h-4 w-4 text-sky-300" />
                        </span>
                        <span className="text-sm font-semibold tracking-tight bg-gradient-to-r from-zinc-100 to-zinc-300 bg-clip-text text-transparent">
                            Paytm
                        </span>
                        {/* <span className="ml-1 rounded bg-white/5 px-1.5 py-0.5 text-[10px] leading-none text-zinc-300 ring-1 ring-inset ring-white/10">
                            Demo
                        </span> */}
                    </Link>
                </div>
            </SidebarHeader>
            <SidebarContent className="bg-transparent">
                <SidebarGroup>
                    <SidebarGroupLabel className="text-zinc-400">Navigation</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            <SidebarMenuItem>
                                <SidebarMenuButton
                                    asChild
                                    isActive={isActive("/dashboard")}
                                    onClick={() => handleMenuItemClick("Dashboard")}
                                    className="text-zinc-300 hover:text-zinc-100 hover:bg-white/5 data-[active=true]:bg-white/10 data-[active=true]:text-zinc-100"
                                >
                                    <Link href="/dashboard">
                                        <LayoutDashboard />
                                        <span>Dashboard</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>

                            <SidebarMenuItem>
                                <SidebarMenuButton
                                    asChild
                                    isActive={isActive("/dashboard/bank")}
                                    onClick={() => handleMenuItemClick("Bank Transfer")}
                                    className="text-zinc-300 hover:text-zinc-100 hover:bg-white/5 data-[active=true]:bg-white/10 data-[active=true]:text-zinc-100"
                                >
                                    <Link href="/dashboard/bank">
                                        <Banknote />
                                        <span>Bank Transfer</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>

                            <SidebarMenuItem>
                                <SidebarMenuButton
                                    asChild
                                    isActive={isActive("/dashboard/p2ptransfer")}
                                    onClick={() => handleMenuItemClick("P2P Transfer")}
                                    className="text-zinc-300 hover:text-zinc-100 hover:bg-white/5 data-[active=true]:bg-white/10 data-[active=true]:text-zinc-100"
                                >
                                    <Link href="/dashboard/p2ptransfer">
                                        <Users />
                                        <span>P2P Transfer</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter className="bg-transparent border-t border-zinc-800/60">
                <div className="flex flex-col gap-2 px-2 pb-2">
                    {status === 'authenticated' ? (
                        <Button
                            variant="outline"
                            onClick={() => signOut()}
                            className="border-zinc-700 text-zinc-300 hover:bg-white/5 hover:text-zinc-100"
                        >
                            Sign out
                        </Button>
                    ) : status === "loading" ? (
                        <Button
                            variant="outline"
                            disabled
                            className="border-zinc-700 text-zinc-500"
                        >
                            Loading...
                        </Button>
                    ) : (
                        <>
                            <Button
                                asChild
                                variant="outline"
                                className="w-full border-zinc-700 text-zinc-300 hover:bg-white/5 hover:text-zinc-100"
                            >
                                <Link href="/auth/signin">Sign in</Link>
                            </Button>
                            <Button
                                asChild
                                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white"
                            >
                                <Link href="/auth/signup">Sign up</Link>
                            </Button>
                        </>
                    )}
                </div>
            </SidebarFooter>
        </Sidebar>
    );
}