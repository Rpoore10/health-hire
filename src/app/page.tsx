"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../lib/firebase";
import { ensureEmployerProfile } from "../lib/createProfile";

export default function Home() {
  const [ready, setReady] = useState(false);
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    const off = onAuthStateChanged(auth, async (u) => {
      setEmail(u?.email ?? null);
      if (u) {
        // pass undefined (not null) to satisfy types
        await ensureEmployerProfile(u.uid, u.email ?? undefined);
      }
      setReady(true);
    });
    return () => off();
  }, []);

  return (
    <main className="p-8 space-y-4">
      <h1 className="text-3xl font-bold">Health Hire</h1>

      {!ready ? (
        <p>Loading…</p>
      ) : (
        <>
          <p className="text-sm">
            {email ? `Signed in as ${email}` : "Not signed in."}
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li><a className="underline" href="/auth">Auth</a></li>
            <li><a className="underline" href="/employer/jobs/new">Post a Job</a></li>
            <li><a className="underline" href="/employer/jobs">My Jobs</a></li>
            <li><a className="underline" href="/jobs">All Jobs</a></li>
          </ul>
        </>
      )}
    </main>
  );
}




