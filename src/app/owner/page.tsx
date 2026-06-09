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
  orderBy,
} from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import LoadingScreen from "@/components/LoadingScreen";
import { getUserRole } from "@/lib/getUserRole";

export default function OwnerDashboard() {
  const { user, isLoaded } = useUser();
  const [signedOut, setSignedOut] = useState(false);
  const { signOut } = useClerk();

  const router = useRouter();

  const [services, setServices] = useState<any[]>([]);
  const [business, setBusiness] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const [bookings, setBookings] = useState<any[]>([]);
  const [loadingBookings, setLoadingBookings] = useState(false);

  const [authorized, setAuthorized] = useState(false);
  const [checkingAccess, setCheckingAccess] = useState(true);

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
      const { role } = await getUserRole(user.id);

      if (role !== "owner") {
        router.replace("/marketplace");
        return;
      }

      setAuthorized(true);

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

        try {
          setLoadingBookings(true);
          const bookingQuery = query(
            collection(db, "bookings"),
            where("businessId", "==", businessData.id),
            orderBy("startAt", "desc"),
          );

          const bookingSnap = await getDocs(bookingQuery);
          setBookings(
            bookingSnap.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            })),
          );
        } catch (error) {
          console.log(error);
        } finally {
          setLoadingBookings(false);
          setCheckingAccess(false);
        }
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

  if (!isLoaded || checkingAccess) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingScreen />
      </div>
    );
  }
  if (!authorized) {
    return null; // redirect already happening
  }

  return (
    <div>
      <nav className="sticky top-0 z-50 py-3 px-20 transparent2 rounded-b-4xl -mt-25">
        <div className="flex justify-between items-center h-15">
          <div className="p-4 h3 h-full" onClick={() => router.push("/")}>
            KTT Booking
          </div>
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
        </div>
      </nav>

      <section className="mx-0 w-full px-4 sm:px-6 lg:px-30 flex flex-col select-none linear-gradient pt-40 pb-50">
        {/* Business */}
        {business && (
          <div className="mb-6">
            <h2 className="text-4xl font-semibold">{business.name}</h2>
            <p className="text-gray-600">{business.description}</p>
          </div>
        )}

        <div className="flex justify-between gap-20">
          {/* Services */}
          <div className="mb-6 w-full">
            <h2 className="text-xl font-semibold mb-2">Services</h2>

            {services.length === 0 ? (
              <p>No services yet.</p>
            ) : (
              <ul className="space-y-2 ">
                {services.map((service) => (
                  <li
                    key={service.id}
                    className="border p-3 rounded flex justify-between w-full transparent2 bg-white/60! border-white/50!
                    transition-transform duration-200 hover:scale-102"
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
          <form
            onSubmit={handleAddService}
            className="space-y-2 flex flex-col "
          >
            <h3 className="text-xl font-semibold mb-2">Add Service</h3>

            <input
              type="text"
              placeholder="Service name"
              value={newService.name}
              onChange={(e) =>
                setNewService({ ...newService, name: e.target.value })
              }
              className="primary-input border-2 transparent-border"
              required
            />

            <input
              type="number"
              placeholder="Price"
              value={newService.price}
              onChange={(e) =>
                setNewService({ ...newService, price: e.target.value })
              }
              className="primary-input border-2 transparent-border"
              required
            />

            <input
              type="number"
              placeholder="Duration (mins)"
              value={newService.duration}
              onChange={(e) =>
                setNewService({ ...newService, duration: e.target.value })
              }
              className="primary-input border-2 transparent-border"
              required
            />

            <Button type="submit" disabled={loading} className="primary-btn">
              {loading ? "Adding..." : "Add Service"}
            </Button>
          </form>
        </div>

        {/* Bookings */}
        <div className="my-10">
          <h2 className="text-xl font-semibold mb-2">Bookings</h2>

          {loadingBookings ? (
            <p>Loading bookings...</p>
          ) : bookings.length === 0 ? (
            <p>No bookings yet.</p>
          ) : (
            <ul className="grid grid-cols-3 gap-4">
              {bookings.map((booking) => (
                <div
                  key={booking.id}
                  className="border-2 border-brand/50 p-3 rounded gap-2 flex flex-col
                  transition-transform duration-300 hover:bg-brand-light/30 hover:scale-105 cursor-pointer"
                >
                  <h1 className="h3">{booking.customerName ?? "Customer"}</h1>
                  <h1>
                    <div className="font-medium mb-2">
                      Service: {booking.serviceName}
                    </div>
                  </h1>
                  <div className="flex justify-between items-center">
                    <div>
                      <div>
                        {booking.startAt.toDate().toLocaleString()} –{" "}
                        {booking.endAt.toDate().toLocaleTimeString([], {
                          hour: "numeric",
                          minute: "2-digit",
                        })}
                      </div>
                      <div>
                        <span className="font-medium italic">Status:</span>{" "}
                        {booking.status}
                      </div>
                    </div>
                    <div>
                      <div>{booking.duration} mins</div>
                      <div>${booking.price}</div>
                    </div>
                  </div>
                </div>
              ))}
            </ul>
          )}
        </div>
      </section>
    </div>
  );
}
