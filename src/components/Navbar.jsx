import React from "react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu, Activity, LayoutDashboard } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  return (
    <nav className="w-full bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border-b border-gray-200 dark:border-zinc-800 shadow-sm fixed top-0 left-0 z-50 transition-colors duration-300">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-3">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
            <Activity className="w-6 h-6 text-blue-500" />
            <h1 className="text-2xl font-extrabold text-blue-500 tracking-tight">MindSync</h1>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-600 dark:text-gray-300">
          <Link to="/dashboard" className="hover:text-blue-500 transition flex items-center gap-2">
            <LayoutDashboard className="w-4 h-4" /> Dashboard
          </Link>
          <Separator orientation="vertical" className="h-6 bg-gray-300 dark:bg-zinc-700" />
          
          {/* Dark Mode Toggle */}
          <ThemeToggle />  
        </div>

        {/* Mobile Menu */}
        <div className="md:hidden flex items-center gap-4">
          <ThemeToggle />
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="w-6 h-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md">
              <SheetHeader>
                <SheetTitle className="text-blue-500 text-2xl font-extrabold">
                  MindSync
                </SheetTitle>
              </SheetHeader>
              <div className="flex flex-col mt-6 gap-4 text-gray-700 dark:text-gray-300 font-medium">
                <Link to="/dashboard" className="flex items-center gap-2 hover:text-blue-500 transition py-2">
                   <LayoutDashboard className="w-5 h-5" /> Dashboard
                </Link>
                <Separator className="my-2" />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}