import { db } from "./firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

export async function createUser(user: any) {
  try {
    const userRef = doc(db, "users", user.id);

    const existingUser = await getDoc(userRef);

    if (existingUser.exists()) {
      return; // ✅ user already exists → STOP
    }

    await setDoc(userRef, {
      email: user.emailAddresses[0].emailAddress,
      name: user.firstName || "",
      createdAt: new Date(),
    }, {merge:true});
  } catch (error) {
    console.error("Error creating user:", error);
  }
}
