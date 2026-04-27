import { headers } from "next/headers";
import { Webhook } from "svix";
import { db } from "@/lib/firebase";
import { doc, setDoc } from "firebase/firestore";

export async function POST(req: Request) {
  console.log("🚨 WEBHOOK HIT");

  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    throw new Error("Missing webhook secret");
  }

  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Missing headers", { status: 400 });
  }

  const payload = await req.text();
  const wh = new Webhook(WEBHOOK_SECRET);

  type ClerkWebhookEvent = {
    type: string;
    data: any; // keep flexible (important)
  };

  let event: ClerkWebhookEvent;

  try {
    event = wh.verify(payload, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as ClerkWebhookEvent;
  } catch (err) {
    console.error("❌ Webhook verification failed:", err);
    return new Response("Error", { status: 400 });
  }

  // ✅ Handle user created event
  if (event.type === "user.created") {
    const user = event.data;

    console.log("🔥 New user from Clerk:", user.id);
    console.log("📍 Writing user:", user.id);
    console.log("📦 FULL USER DATA:", JSON.stringify(user, null, 2));

    let primaryEmail: string | null = null;

    // ✅ Try to get email normally
    if (user.email_addresses && user.email_addresses.length > 0) {
      const match = user.email_addresses.find(
        (email: any) => email.id === user.primary_email_address_id,
      );
      primaryEmail = match?.email_address || null;
    }

    // ⚠️ Fallback if missing
    if (!primaryEmail) {
      console.log("⚠️ No email found in webhook payload");
      primaryEmail = "unknown@email.com";
    }

    const role =
      user.unsafe_metadata?.role || user.public_metadata?.role || "customer";

    await setDoc(
      doc(db, "users", user.id),
      {
        email: primaryEmail,
        name: user.first_name || "",
        role,
        createdAt: new Date(),
      },
      { merge: true },
    );

    console.log("✅ User saved to Firebase");
  }

  return new Response("OK", { status: 200 });
}
