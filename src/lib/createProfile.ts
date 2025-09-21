// src/lib/createProfile.ts
import { db } from "./firebase";
import { doc, getDoc, setDoc, serverTimestamp, updateDoc } from "firebase/firestore";

/** Ensure an employer profile doc exists at employers/{uid}. Safe to call every login. */
export async function ensureEmployerProfile(uid: string, email?: string | null) {
  const ref = doc(db, "employers", uid);
  const snap = await getDoc(ref);
  if (!snap.exists()) {
    await setDoc(ref, {
      email: email ?? null,
      orgName: null,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  } else {
    await updateDoc(ref, { updatedAt: serverTimestamp() });
  }
}

