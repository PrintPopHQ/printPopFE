"use client";

import { ShoppingCart, User, LogOut, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { getUser, removeUser, StoredUser } from '@/lib/auth-store';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

export function UserActions() {
  const [cartCount, setCartCount] = useState(0);
  const [user, setUser] = useState<StoredUser | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Read auth state
    setUser(getUser());

    // Sync cart count
    const updateCount = () => {
      try {
        const raw = localStorage.getItem('printpop_cart');
        const items = raw ? JSON.parse(raw) : [];
        const count = items.reduce((acc: number, item: any) => acc + item.quantity, 0);
        setCartCount(count);
      } catch (e) {
        console.error(e);
      }
    };

    updateCount();
    window.addEventListener('cart_updated', updateCount);
    return () => window.removeEventListener('cart_updated', updateCount);
  }, []);

  const handleLogout = () => {
    removeUser();
    setUser(null);
    toast.success("Logged out", { description: "See you next time!" });
    router.push('/signin');
  };

  return (
    <div className="flex items-center gap-1 sm:gap-2">
      <Link href="/cart">
        <Button variant="ghost" size="icon" className="relative rounded-full" aria-label="Cart">
          <ShoppingCart className="h-5 w-5" />
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-secondary text-[10px] font-bold text-white animate-in zoom-in">
              {cartCount}
            </span>
          )}
        </Button>
      </Link>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="rounded-full border border-[#373737] hover:border-[#5CE1E64D] shadow-glow-cyan">
            <User className="h-5 w-5" />
            <span className="sr-only">User menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="bg-black border border-[#373737] shadow-glow-cyan">
          {user ? (
            <>
              <DropdownMenuLabel className="text-xs text-gray-400 font-normal truncate max-w-[180px]">
                {user.email}
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-zinc-800" />
              <DropdownMenuItem className="cursor-pointer" asChild>
                <Link href="/profile">Profile</Link>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">Orders</DropdownMenuItem>
              <DropdownMenuSeparator className="bg-zinc-800" />
              <DropdownMenuItem
                className="cursor-pointer text-red-400 focus:text-red-400 focus:bg-red-400/10"
                onClick={handleLogout}
              >
                <LogOut size={14} className="mr-2" />
                Log out
              </DropdownMenuItem>
            </>
          ) : (
            <>
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-zinc-800" />
              <DropdownMenuItem className="cursor-pointer" asChild>
                <Link href="/signin" className="flex items-center gap-2">
                  <LogIn size={14} />
                  Sign In
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer" asChild>
                <Link href="/signup">Create Account</Link>
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

