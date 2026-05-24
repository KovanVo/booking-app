"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs, query } from "firebase/firestore";
import BusinessCard from "@/components/BusinessCard";
import MarketplaceHero from "@/components/MarketplaceHero";
import { ProfileButton } from "@/components/ProfileButton";
import { useRouter } from "next/navigation";
import Footer from "@/components/Footer";

export default function Marketplace() {
  const [businesses, setBusinesses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  useEffect(() => {
    const fetchBusinesses = async () => {
      try {
        const snap = await getDocs(collection(db, "businesses"));

        const data = snap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setBusinesses(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchBusinesses();
  }, []);

  

  return (
    <div>
      <nav className="sticky top-0 z-50 py-3 px-20 transparent2 rounded-b-4xl -mt-25">
        <div className="flex justify-between items-center h-15">
          <div className="p-4 h3 h-full cursor-pointer" onClick={() => router.push("/")}>
            KTT Booking
          </div>
          <div >
            <ProfileButton />
          </div>
        </div>
      </nav>

      <MarketplaceHero />

      <section className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-10 my-10 flex flex-col gap-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {businesses.map((business) => (
            <BusinessCard
              key={business.id}
              id={business.id}
              name={business.name}
              description={business.description}
            />
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}