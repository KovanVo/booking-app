"use client";

import {
  ChevronDown,
  ChevronRight,
  CreditCardIcon,
  LogOutIcon,
  SettingsIcon,
  UserIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { useClerk, useUser } from "@clerk/nextjs";
import Image from "next/image";

export function ProfileButton() {
  const [signedOut, setSignedOut] = useState(false);
  const { signOut } = useClerk();
  const { user } = useUser();
  const [isOpen, setIsOpen] = useState(false);

  const handleSignOut = () => {
    setSignedOut(true);

    setTimeout(() => {
      signOut({ redirectUrl: "/" });
    }, 10);
  };

  return (
    <DropdownMenu onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="p-2 border rounded-full h-full w-20 transition-transform active:scale-95 select-none justify-between pr-3"
        >
          {user && (
            <Image
              src={user.imageUrl}
              alt="profile"
              width={30}
              height={30}
              className="w-auto h-auto rounded-full"
            />
          )}
          <div className="cursor-pointer hover:bg-gray-100">
            <ChevronRight
              className={`transition-transform duration-200 ${
                isOpen ? "rotate-90" : "rotate-0"
              }`}
            />
          </div>
        </Button>
        {/* This is user's profile picture  */}
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-white rounded-xl p-2">
        <h1 className="p-2 text-md font-bold">{user?.fullName}</h1>
        {/* // this is user's name */}
        <DropdownMenuItem className="transition duration-300 hover:bg-brand-dark/10">
          <UserIcon />
          Profile
        </DropdownMenuItem>
        <DropdownMenuItem className="transition duration-300 hover:bg-brand-dark/10">
          <CreditCardIcon />
          Billing
        </DropdownMenuItem>
        <DropdownMenuItem className="transition duration-300 hover:bg-brand-dark/10">
          <SettingsIcon />
          Settings
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          variant="destructive"
          onClick={handleSignOut}
          className="transition duration-300 hover:bg-red-100 hover:text-red-800"
        >
          <LogOutIcon />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
