"use client";

import { useEffect, useState } from "react";
import { useClerk, useUser } from "@clerk/nextjs";
import { db } from "@/lib/firebase";
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  getDoc,
  doc,
} from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { createUser } from "@/lib/createUser";
import { useRouter } from "next/navigation";

type AccessState = "checking" | "authorized" | "unauthorized";

export default function OwnerDashboard() {
  const { user, isLoaded } = useUser();
  const [signedOut, setSignedOut] = useState(false);
  const { signOut } = useClerk();

  const router = useRouter();

  const [services, setServices] = useState<any[]>([]);
  const [business, setBusiness] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleSignOut = () => {
    setSignedOut(true);

    setTimeout(() => {
      signOut({ redirectUrl: "/" });
    }, 10);
  };

  const [newService, setNewService] = useState({
    name: "",
    price: "",
    duration: "",
  });

  // 🔥 Fetch business + services
  useEffect(() => {
    if (!isLoaded || !user) return;

    const init = async () => {
      const userRef = doc(db, "users", user.id);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) return;

      const userData = userSnap.data();

      if (userData.role !== "owner") {
        router.push("/sign-up");
        return;
      }

      // 🔥 ONLY fetch if authorized
      const businessQuery = query(
        collection(db, "businesses"),
        where("ownerId", "==", user.id),
      );

      const businessSnap = await getDocs(businessQuery);

      if (!businessSnap.empty) {
        const businessData = {
          id: businessSnap.docs[0].id,
          ...businessSnap.docs[0].data(),
        };

        setBusiness(businessData);

        const serviceQuery = query(
          collection(db, "services"),
          where("businessId", "==", businessData.id),
        );

        const serviceSnap = await getDocs(serviceQuery);

        setServices(
          serviceSnap.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          })),
        );
      }
    };

    init();
  }, [isLoaded, user?.id]);

  // ➕ Add new service
  const handleAddService = async (e: any) => {
    e.preventDefault();
    if (!user || !business) return;

    setLoading(true);

    try {
      const docRef = await addDoc(collection(db, "services"), {
        businessId: business.id,
        ownerId: user.id,
        name: newService.name,
        price: Number(newService.price),
        duration: Number(newService.duration),
        createdAt: new Date(),
      });

      // update UI instantly
      setServices((prev) => [...prev, { id: docRef.id, ...newService }]);

      setNewService({ name: "", price: "", duration: "" });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Owner Dashboard</h1>

      {/* Business */}
      {business && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold">{business.name}</h2>
          <p className="text-gray-600">{business.description}</p>
        </div>
      )}

      {/* Services */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Services</h2>

        {services.length === 0 ? (
          <p>No services yet.</p>
        ) : (
          <ul className="space-y-2">
            {services.map((service) => (
              <li
                key={service.id}
                className="border p-3 rounded flex justify-between"
              >
                <span>{service.name}</span>
                <span>
                  ${service.price} • {service.duration} mins
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Add Service */}
      <form onSubmit={handleAddService} className="space-y-2">
        <h3 className="font-semibold">Add Service</h3>

        <input
          type="text"
          placeholder="Service name"
          value={newService.name}
          onChange={(e) =>
            setNewService({ ...newService, name: e.target.value })
          }
          className="w-full border p-2 rounded"
          required
        />

        <input
          type="number"
          placeholder="Price"
          value={newService.price}
          onChange={(e) =>
            setNewService({ ...newService, price: e.target.value })
          }
          className="w-full border p-2 rounded"
          required
        />

        <input
          type="number"
          placeholder="Duration (mins)"
          value={newService.duration}
          onChange={(e) =>
            setNewService({ ...newService, duration: e.target.value })
          }
          className="w-full border p-2 rounded"
          required
        />

        <Button type="submit" disabled={loading} className="primary-btn">
          {loading ? "Adding..." : "Add Service"}
        </Button>

        <Button
          type="button"
          onClick={handleSignOut}
          className="light-btn text-3xs flex items-center gap-2 transition-all duration-300 border border-brand"
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
      </form>
    </div>
  );
}
