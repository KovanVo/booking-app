"use client";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function SelectRolePage() {
  const router = useRouter();

  const handleSelect = (role: "customer" | "owner") => {
    router.push(`/sign-up?role=${role}`);
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      <div className="flex items-center justify-center px-4 sm:px-6 lg:px-10 py-10">
        <div className="w-full max-w-md flex flex-col gap-4 text-center">
          <h1 className="h1 mb-2">Sign up/Log in</h1>

          <Button
            className="w-full text-base sm:text-lg py-6 sm:py-7 border border-brand-dark/20 text-left px-4 sm:px-5 hover:bg-brand/20"
            onClick={() => handleSelect("customer")}
          >
            <div className="w-full">I'm a customer</div>
            <Image src="/icons/arrow.svg" alt="arrow" width={20} height={20} />
          </Button>

          <Button
            className="w-full text-base sm:text-lg py-6 sm:py-7 border border-brand-dark/20 text-left px-4 sm:px-5 hover:bg-brand/20"
            onClick={() => handleSelect("owner")}
          >
            <div className="w-full">I'm a business owner</div>
            <Image src="/icons/arrow.svg" alt="arrow" width={20} height={20} />
          </Button>
        </div>
      </div>

      <div className="hidden lg:block bg-[url('/images/woman-working.jpg')] bg-cover bg-center" />
    </div>
  );
}
