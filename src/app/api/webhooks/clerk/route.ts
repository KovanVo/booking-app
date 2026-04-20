import { headers } from "next/headers";
import { Webhook } from "svix";
import { db } from "@/lib/firebase";
import { doc, setDoc } from "firebase/firestore";

export async function POST(req: Request) {
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
    data: {
      id: string;
      first_name?: string | null;
      email_addresses?: { email_address: string }[];
    };
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

    const primaryEmail = user.email_addresses?.[0]?.email_address;
    if (!primaryEmail) {
      return new Response("Missing user email", { status: 400 });
    }

    await setDoc(doc(db, "users", user.id), {
      email: primaryEmail,
      name: user.first_name || "",
      createdAt: new Date(),
    });

    console.log("✅ User saved to Firebase");
  }

  return new Response("OK", { status: 200 });
}
