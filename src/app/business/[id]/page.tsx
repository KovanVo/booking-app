"use client";

import Footer from "@/components/Footer";
import { ProfileButton } from "@/components/ProfileButton";
import { Button } from "@/components/ui/button";
import { db } from "@/lib/firebase";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { useParams } from "next/navigation";
import { useState } from "react";
import { useEffect } from "react";

export default function businessPage() {
  const { id } = useParams();

  const [business, setBusiness] = useState<any>(null);
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchBusinessAndServices = async () => {
      if (!id) return;

      try {
        const businessSnap = await getDoc(doc(db, "businesses", id as string));

        if (businessSnap.exists()) {
          setBusiness({
            id: businessSnap.id,
            ...businessSnap.data(),
          });
        }

        const servicesQuery = await query(
          collection(db, "services"),
          where("businessId", "==", id),
        );

        const servicesSnap = await getDocs(servicesQuery);

        const servicesData = servicesSnap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setServices(servicesData);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchBusinessAndServices();
  }, [id]);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <nav className="sticky top-0 z-50 flex justify-between items-center py-3 px-20 transparent2 rounded-b-4xl">
        <div className="p-4 h3">KTT Booking</div>
        <ProfileButton />
      </nav>
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-10 mt-10 flex flex-col gap-5">
        <h1 className="text-6xl font-bold">{business?.name}</h1>
        <p className="text-sm text-gray-500">{business?.description}</p>

        {/* Images */}
        <div className="grid grid-flow-col grid-rows-4  gap-5">
          <div className="row-span-4 col-span-5 bg-[url('/images/image-placeholder.png')] rounded-4xl bg-cover h-120"></div>
          <div className="col-span-3 row-span-2 bg-[url('/images/image-placeholder.png')] rounded-4xl bg-cover"></div>
          <div className="col-span-3 row-span-2 bg-[url('/images/image-placeholder.png')] rounded-4xl bg-cover"></div>
        </div>

        <div className="mt-20 mb-30">
          <h2 className="h2">Services</h2>
          <div className="pt-10 grid grid-row gap-6">
            {services.length > 0 ? (
              services.map((service) => (
                <div
                  key={service.id}
                  className="border-2 p-6 rounded-3xl shadow border-brand/50 transition duration-200 hover:bg-brand/10"
                >
                  <div className="flex justify-between items-center ">
                    <div>
                      <h2 className="text-lg font-bold">{service.name}</h2>
                      <p className="text-brand-dark/50">
                        {service.duration} mins
                      </p>
                      <p className="mt-4">${service.price}</p>
                    </div>

                    <div>
                      <Button className="w-25 border border-brand/50 rounded-full h-10 primary-btn">
                        Book
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div>No services yet!</div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
