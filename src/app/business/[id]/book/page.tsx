"use client";

import { Button } from "@/components/ui/button";
import { db } from "@/lib/firebase";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  Timestamp,
  where,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { useParams, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useUser } from "@clerk/nextjs";
import LoadingScreen from "@/components/LoadingScreen";

export default function Book() {
  const { user } = useUser();
  const { id: businessId } = useParams();
  const searchParams = useSearchParams();
  const serviceId = searchParams.get("serviceId");

  const [business, setBusiness] = useState<any>(null);
  const [service, setService] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedSlot, setSelectedSlot] = useState<Date | null>(null);
  const [existingBookings, setExistingBookings] = useState<any>([]);
  const [loadingBookings, setLoadingBookings] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const customerName =
    user?.fullName || [user?.firstName].filter(Boolean).join(" ") || "Unknown";

  useEffect(() => {
    const fetchData = async () => {
      if (!businessId || !serviceId) {
        setError("Missing business or services");
        setLoading(false);
        return;
      }

      try {
        const businessRef = doc(db, "businesses", businessId as string);
        const businessSnap = await getDoc(businessRef);

        if (!businessSnap.exists()) {
          setError("No business found");
          return;
        }

        const businessData = {
          id: businessSnap.id,
          ...businessSnap.data(),
        };

        setBusiness(businessData);

        const serviceRef = doc(db, "services", serviceId as string);
        const serviceSnap = await getDoc(serviceRef);

        if (!serviceSnap.exists()) {
          setError("No services found!");
          return;
        }

        const serviceData = {
          id: serviceSnap.id,
          ...serviceSnap.data(),
        };

        if (
          (serviceData as unknown as { businessId: string }).businessId !==
          businessId
        ) {
          setError("The service does not belong to this bussiness.");
          return;
        }

        setService(serviceData);
      } catch (error) {
        setError("Internal error");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [businessId, serviceId]);

  useEffect(() => {
    const fetchBookings = async () => {
      if (!businessId || !selectedDate) {
        setLoadingBookings(true);
        setExistingBookings([]);
        return;
      }

      try {
        const [y, m, d] = selectedDate.split("-").map(Number);
        const dayStart = new Date(y, m - 1, d, 0, 0, 0, 0);
        const dayEnd = new Date(y, m - 1, d + 1, 0, 0, 0, 0);

        const bookingsQuery = query(
          collection(db, "bookings"),
          where("businessId", "==", businessId),
          where("startAt", ">=", Timestamp.fromDate(dayStart)), // Timestamp
          where("startAt", "<", Timestamp.fromDate(dayEnd)),
        );

        const snap = await getDocs(bookingsQuery);

        const bookings = snap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setExistingBookings(bookings);
      } catch (error) {
        console.error(error);
        setExistingBookings([]);
      } finally {
        setLoadingBookings(false);
      }
    };
    fetchBookings();
  }, [businessId, selectedDate]);

  function overlaps(
    slotStart: Date,
    slotEnd: Date,
    booking: { startAt: any; endAt: any; status?: string },
  ) {
    if (booking.status === "cancelled") return false;

    const bookingStart = booking.startAt.toDate();
    const bookingEnd = booking.endAt.toDate();

    return slotStart < bookingEnd && slotEnd > bookingStart;
  }

  function generateSlots(dayStart: Date, durationMins: number) {
    const slots: Date[] = [];
    const open = new Date(dayStart);
    open.setHours(9, 0, 0, 0); // 9:00 AM local
    const close = new Date(dayStart);
    close.setHours(17, 0, 0, 0); // 5:00 PM local
    let current = new Date(open);
    while (current.getTime() + durationMins * 60_000 <= close.getTime()) {
      slots.push(new Date(current)); // copy, don't reuse same object
      current = new Date(current.getTime() + durationMins * 60_000);
    }
    return slots;
  }

  const handleConfirmBooking = async () => {
    if (!user || !selectedSlot || !service || !businessId) {
      setError("Missing user, service, or business");
      return;
    }
    setIsSubmitting(true);

    try {
      const startAt = new Date(selectedSlot);

      const endAt = new Date(startAt.getTime() + service.duration * 60000);

      const ref = await addDoc(collection(db, "bookings"), {
        userId: user?.id,
        customerName,
        businessId,
        serviceId: service.id,
        serviceName: service.name,
        price: service.price,
        duration: service.duration,
        startAt: Timestamp.fromDate(startAt),
        endAt: Timestamp.fromDate(endAt),
        status: "pending",
        createdAt: serverTimestamp(),
      });
    } catch (error) {
      console.log(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const allSlots = useMemo(() => {
    if (!selectedDate || !service) return [];
    const [y, m, d] = selectedDate.split("-").map(Number);
    const dayStart = new Date(y, m - 1, d, 0, 0, 0, 0);

    return generateSlots(dayStart, service.duration);
  }, [selectedDate, service]);

  const availableSlots = useMemo(() => {
    if (!service) return [];

    const durationMs = Number(service.duration) * 60_000;

    return allSlots.filter((slot) => {
      const slotStart = slot;
      const slotEnd = new Date(slot.getTime() + durationMs);

      const isTaken = existingBookings.some(
        (booking: { startAt: Date; endAt: Date; status?: string }) =>
          overlaps(slotStart, slotEnd, booking),
      );

      return !isTaken;
    });
  }, [allSlots, existingBookings, service]);

  const today = new Date();
  const todayStr = [
    today.getFullYear(),
    String(today.getMonth() + 1).padStart(2, "0"),
    String(today.getDate()).padStart(2, "0"),
  ].join("-");

  if (loading) return <LoadingScreen />;
  if (error) return <div>{error}</div>;
  if (!business || !service) return <div>Not found</div>;

  return (
    <div>
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-10 mt-10 flex flex-col gap-5">
        <div className="h1">Selected services</div>

        <div
          key={service.id}
          className="border-2 p-6 rounded-3xl shadow border-brand/50 transition duration-200 hover:bg-brand/10"
        >
          <div className="flex justify-between items-center ">
            <div>
              <h2 className="text-lg font-bold">{service.name}</h2>
              <p className="text-brand-dark/50">{service.duration} mins</p>
              <p className="my-4">${service.price}</p>

              <input
                type="date"
                value={selectedDate}
                onChange={(e) => {
                  setSelectedDate(e.target.value);
                  setSelectedSlot(null); // reset time when date changes
                }}
                min={todayStr}
                className="border rounded-lg px-3 py-2 mb-4"
              />
              {selectedDate === "" ? (
                <p className="font-medium">Pick a date</p>
              ) : loadingBookings ? (
                <p>Loading times...</p>
              ) : availableSlots.length === 0 ? (
                <p>No times available this day</p>
              ) : (
                <>
                  <p className="mb-2">Choose a time</p>
                  <div className="flex flex-wrap gap-2">
                    {availableSlots.map((slot) => (
                      <button
                        key={slot.getTime()}
                        type="button"
                        onClick={() => setSelectedSlot(slot)}
                        className={`border rounded-xl px-4 py-2 transition border-brand-dark/40 ${
                          selectedSlot?.getTime() === slot.getTime()
                            ? "bg-brand text-white"
                            : " hover:bg-brand hover:text-white"
                        }`}
                      >
                        {slot.toLocaleTimeString([], {
                          hour: "numeric",
                          minute: "2-digit",
                        })}
                      </button>
                    ))}
                  </div>
                </>
              )}

              {selectedSlot && (
                <Button
                  onClick={handleConfirmBooking}
                  disabled={isSubmitting}
                  className="primary-btn mt-4"
                >
                  {isSubmitting ? "Booking..." : "Confirm booking!"}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
