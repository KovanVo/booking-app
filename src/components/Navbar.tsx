"use client";

import { useClerk } from "@clerk/nextjs";
import { Button } from "./ui/button";
import { useState } from "react";
import { useRouter } from "next/navigation";

function Navbar() {
  const [signedOut, setSignedOut] = useState(false);

  const router = useRouter();

  const handleSignOut = () => {
    setSignedOut(true);

    setTimeout(() => {
      signOut({ redirectUrl: "/" });
    }, 1000);
  };

  const { signOut } = useClerk();

  return (
    <nav className="sticky top-0 z-50 flex justify-between items-center py-3 px-20 transparent2 rounded-b-4xl">
      <h1 className="h3">KTT Booking</h1>
      <div className="flex items-center gap-4">
        <div className="justify-between hidden md:block">
          <Button className="menu-items text-3xs">Business types</Button>
          <Button className="menu-items text-3xs">Features</Button>
          <Button className="menu-items text-3xs">Pricing</Button>

          <Button
            type="button"
            onClick={() => router.push("/marketplace")}
            className="menu-items text-3xs"
          >
            Marketplace
          </Button>
        </div>

        <Button
          type="button"
          onClick={() => router.push("/select-role")}
          className="primary-btn text-3xs!"
        >
          Sign up
        </Button>

        <Button
          onClick={handleSignOut}
          className="light-btn text-3xs flex items-center gap-2 transition-all duration-300"
        >
          {signedOut ? "Signed out" : "Sign out"}

          <span
            className={`transition-all duration-300 ${
              signedOut ? "opacity-100 scale-100" : "opacity-0 scale-50"
            }`}
          >
            ✓
          </span>
        </Button>
      </div>
    </nav>
  );
}

export default Navbar;
