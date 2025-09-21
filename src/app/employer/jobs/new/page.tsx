"use client";

import { useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase";
import {
  addDoc,
  collection,
  serverTimestamp,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

type NewJobPayload = {
  employerId: string;
  title: string;
  location: string; // "City, ST"
  minPay: number;   // hourly
  maxPay: number;   // hourly
  shifts: string[]; // ["Nights", "3x12"]
  modalities: string[]; // ["OB/GYN", "General"]
  mustHaveCerts: string[]; // ["RDMS"]
  createdAt: any;
};

export default function NewJobPage() {
  const [uid, setUid] = useState<string | null>(null);
  const [title, setTitle] = useState("Ultrasound Technologist");
  const [location, setLocation] = useState("Medford, OR");
  const [minPay, setMinPay] = useState("45");
  const [maxPay, setMaxPay] = useState("62");
  const [shifts, setShifts] = useState("Nights, 3x12");
  const [modalities, setModalities] = useState("OB/GYN, General");
  const [mustCerts, setMustCerts] = useState("RDMS");
  const [msg, setMsg] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const off = onAuthStateChanged(auth, (u) => setUid(u?.uid ?? null));
    return () => off();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMsg("");
    if (!uid) {
      setMsg("Please sign in first at /auth.");
      return;
    }

    // basic validation
    const min = Number(minPay);
    const max = Number(maxPay);
    if (!title.trim() || !location.trim() || Number.isNaN(min) || Number.isNaN(max)) {
      setMsg("Please fill title, location, and valid pay numbers.");
      return;
    }
    if (min > max) {
      setMsg("Min pay cannot be greater than max pay.");
      return;
    }

    const payload: NewJobPayload = {
      employerId: uid,
      title: title.trim(),
      location: location.trim(),
      minPay: min,
      maxPay: max,
      shifts: shifts.split(",").map(s => s.trim()).filter(Boolean),
      modalities: modalities.split(",").map(m => m.trim()).filter(Boolean),
      mustHaveCerts: mustCerts.split(",").map(c => c.trim()).filter(Boolean),
      createdAt: serverTimestamp(),
    };

    try {
      setSubmitting(true);
      await addDoc(collection(db, "jobs"), payload);
      setMsg("Job posted ✅");
      // optional: clear fields
      // setTitle(""); setLocation(""); setMinPay(""); setMaxPay(""); setShifts(""); setModalities(""); setMustCerts("");
    } catch (err) {
      let text = "Error posting job";
      if (err && typeof err === "object" && "message" in err) {
        const e = err as { message?: unknown };
        text = typeof e.message === "string" ? e.message : text;
      }
      setMsg(text);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-xl mx-auto p-6 space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Post a Job</h1>
        <a className="text-sm underline" href="/auth">/auth</a>
      </div>

      {!uid && (
        <p className="text-sm">
          You’re not signed in. Go to <a className="underline" href="/auth">/auth</a>.
        </p>
      )}

      <form onSubmit={handleSubmit} className="space-y-3">
        <label className="block">
          <span className="text-sm font-medium">Title</span>
          <input
            className="w-full border p-2 rounded"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Ultrasound Technologist"
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium">Location</span>
          <input
            className="w-full border p-2 rounded"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="City, ST"
          />
        </label>

        <div className="grid grid-cols-2 gap-3">
          <label className="block">
            <span className="text-sm font-medium">Min Pay (hourly)</span>
            <input
              className="w-full border p-2 rounded"
              value={minPay}
              onChange={(e) => setMinPay(e.target.value)}
              inputMode="decimal"
              placeholder="45"
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium">Max Pay (hourly)</span>
            <input
              className="w-full border p-2 rounded"
              value={maxPay}
              onChange={(e) => setMaxPay(e.target.value)}
              inputMode="decimal"
              placeholder="62"
            />
          </label>
        </div>

        <label className="block">
          <span className="text-sm font-medium">Shifts (comma-separated)</span>
          <input
            className="w-full border p-2 rounded"
            value={shifts}
            onChange={(e) => setShifts(e.target.value)}
            placeholder="Nights, 3x12"
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium">Modalities (comma-separated)</span>
          <input
            className="w-full border p-2 rounded"
            value={modalities}
            onChange={(e) => setModalities(e.target.value)}
            placeholder="OB/GYN, General"
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium">Must-have certs (comma-separated)</span>
          <input
            className="w-full border p-2 rounded"
            value={mustCerts}
            onChange={(e) => setMustCerts(e.target.value)}
            placeholder="RDMS"
          />
        </label>

        <button
          className="w-full border p-2 rounded font-semibold disabled:opacity-60"
          type="submit"
          disabled={submitting || !uid}
        >
          {submitting ? "Posting…" : "Post Job"}
        </button>
      </form>

      {msg && <p className="text-sm">{msg}</p>}
    </div>
  );
}
