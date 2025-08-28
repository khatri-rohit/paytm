"use client";

import { signOut, useSession } from 'next-auth/react';
import { Dispatch, SetStateAction } from 'react';
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Banknote, Users } from "lucide-react";
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
        <Sidebar className="bg-gray-900 border-gray-700">
            <SidebarHeader className="bg-gray-900 border-gray-700">
                <div className="px-2 py-1">
                    <Link href="/dashboard" className="font-semibold text-sm text-white">
                        Paytm
                    </Link>
                </div>
            </SidebarHeader>
            <SidebarContent className="bg-gray-900">
                <SidebarGroup>
                    <SidebarGroupLabel className="text-gray-400">Navigation</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            <SidebarMenuItem>
                                <SidebarMenuButton 
                                    asChild 
                                    isActive={isActive("/dashboard")} 
                                    onClick={() => handleMenuItemClick("Dashboard")}
                                    className="text-gray-300 hover:text-white hover:bg-gray-800 data-[state=active]:bg-gray-800 data-[state=active]:text-white"
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
                                    isActive={isActive("/dashboard/transfer")}
                                    onClick={() => handleMenuItemClick("Bank Transfer")}
                                    className="text-gray-300 hover:text-white hover:bg-gray-800 data-[state=active]:bg-gray-800 data-[state=active]:text-white"
                                >
                                    <Link href="/dashboard/transfer">
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
                                    className="text-gray-300 hover:text-white hover:bg-gray-800 data-[state=active]:bg-gray-800 data-[state=active]:text-white"
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
            <SidebarFooter className="bg-gray-900 border-gray-700">
                <div className="flex flex-col gap-2 px-2 pb-2">
                    {status === 'authenticated' ? (
                        <Button 
                            variant="outline" 
                            onClick={() => signOut()}
                            className="border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white"
                        >
                            Sign out
                        </Button>
                    ) : status === "loading" ? (
                        <Button 
                            variant="outline" 
                            disabled
                            className="border-gray-600 text-gray-500"
                        >
                            Loading...
                        </Button>
                    ) : (
                        <>
                            <Button 
                                asChild 
                                variant="outline" 
                                className="w-full border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white"
                            >
                                <Link href="/auth/signin">Sign in</Link>
                            </Button>
                            <Button 
                                asChild 
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
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