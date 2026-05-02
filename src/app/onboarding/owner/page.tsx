"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { db } from "@/lib/firebase";
import { collection, addDoc, doc, setDoc } from "firebase/firestore";

export default function OwnerOnboarding() {
  const { user } = useUser();
  const router = useRouter();

  const [businessName, setBusinessName] = useState("");
  const [description, setDescription] = useState("");
  const [serviceName, setServiceName] = useState("");
  const [price, setPrice] = useState("");
  const [duration, setDuration] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);

    try {
      // 1. Create business
      const businessRef = await addDoc(collection(db, "businesses"), {
        ownerId: user.id,
        name: businessName,
        description,
        createdAt: new Date(),
      });

      // 2. Create first service
      await addDoc(collection(db, "services"), {
        businessId: businessRef.id,
        ownerId: user.id,
        name: serviceName,
        price: Number(price),
        duration: Number(duration),
        createdAt: new Date(),
      });

      // 3. Save businessId to user
      await setDoc(
        doc(db, "users", user.id),
        {
          businessId: businessRef.id,
        },
        { merge: true }
      );

      console.log("✅ Onboarding complete");

      // 4. Redirect
      router.push("/owner");
    } catch (error) {
      console.error("❌ Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md space-y-4 bg-white p-6 rounded-xl shadow"
      >
        <h1 className="text-2xl font-bold">Set up your business</h1>

        {/* Business Name */}
        <input
          type="text"
          placeholder="Business Name"
          value={businessName}
          onChange={(e) => setBusinessName(e.target.value)}
          className="w-full border p-2 rounded"
          required
        />

        {/* Description */}
        <textarea
          placeholder="Business Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border p-2 rounded"
          required
        />

        <hr />

        <h2 className="font-semibold">Your First Service</h2>

        {/* Service Name */}
        <input
          type="text"
          placeholder="Service Name"
          value={serviceName}
          onChange={(e) => setServiceName(e.target.value)}
          className="w-full border p-2 rounded"
          required
        />

        {/* Price */}
        <input
          type="number"
          placeholder="Price ($)"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="w-full border p-2 rounded"
          required
        />

        {/* Duration */}
        <input
          type="number"
          placeholder="Duration (minutes)"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
          className="w-full border p-2 rounded"
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-black text-white py-2 rounded"
        >
          {loading ? "Creating..." : "Create Business"}
        </button>
      </form>
    </div>
  );
}