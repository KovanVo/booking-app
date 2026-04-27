"use client";

import { SignUp } from "@clerk/nextjs";
import { useSearchParams } from "next/navigation";

export default function Page() {
  const searchParams = useSearchParams();
  const rawRole = searchParams.get("role");

  const role = rawRole === "customer" || rawRole === "owner" ? rawRole : null;

  return (
    <div className="flex justify-center items-center h-screen">
      <SignUp unsafeMetadata={role ? { role } : undefined} />
    </div>
  );
}