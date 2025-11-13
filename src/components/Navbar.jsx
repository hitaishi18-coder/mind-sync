import React from "react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu } from "lucide-react";

export default function Navbar() {
  return (
    <nav className="w-full bg-white/70 backdrop-blur-md border-b border-gray-200 shadow-sm fixed top-0 left-0 z-50">
      <div className="max-w-6xl mx-auto flex justify-between items-center px-6 py-3">
        {/* Logo */}
        <h1 className="text-2xl font-extrabold text-blue-500">MindSync</h1>

        {/* Desktop Links */}

        <div className="hidden md:flex items-center gap-6 text-gray-700 font-medium">
  <a href="/" className="hover:text-blue-500 transition">
    Home
  </a>
  <a href="/about" className="hover:text-blue-500 transition">
    About
  </a>
  <a href="/contact" className="hover:text-blue-500 transition">
    Contact
  </a>
  <Separator orientation="vertical" className="h-6 bg-gray-300" />

  <ThemeToggle />  

  <a href="/login">
    <Button variant="outline" className="hover:bg-blue-500 hover:text-white">
      Login
    </Button>
  </a>
  <a href="/signup">
    <Button className="bg-blue-500 text-white hover:bg-blue-500">
      Sign Up
    </Button>
  </a>
</div>

 

        {/* Mobile Menu */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="w-6 h-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-white/95 backdrop-blur-md">
              <SheetHeader>
                <SheetTitle className="text-blue-500 text-2xl font-extrabold">
                  MindSync
                </SheetTitle>
              </SheetHeader>
              <div className="flex flex-col mt-6 gap-4 text-gray-700 font-medium">
                <a href="/" className="hover:text-blue-500 transition">
                  Home
                </a>
                <a href="/about" className="hover:text-blue-500 transition">
                  About
                </a>
                <a href="/contact" className="hover:text-blue-500 transition">
                  Contact
                </a>
                <Separator className="my-2" />
                <a href="/login">
                  <Button variant="outline" className="w-full hover:bg-blue-500 hover:text-white">
                    Login
                  </Button>
                </a>
                <a href="/signup">
                  <Button className="w-full bg-blue-500 text-white hover:bg-blue-500">
                    Sign Up
                  </Button>
                </a>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
