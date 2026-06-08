import { db } from "./firebase";
import { doc, getDoc } from "firebase/firestore";

export type UserRole = "customer" | "owner";

export type UserRoleResult = {
  role: UserRole | null;
  businessId?: string;
};

export async function getUserRole(userId: string): Promise<UserRoleResult> {
  const userRef = doc(db, "users", userId);
  const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) {
    return { role: null };
  }

  const data = userSnap.data();

  return {
    role: (data.role as UserRole) ?? null,
    businessId: data.businessId,
  };
}