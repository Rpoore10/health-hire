"use client";

import { useState } from "react";
import { auth } from "@/lib/firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
} from "firebase/auth";

export default function AuthPage() {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [msg, setMsg] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMsg("");
    try {
      if (mode === "signin") {
        await signInWithEmailAndPassword(auth, email, pw);
        setMsg("Signed in ✅");
      } else {
        await createUserWithEmailAndPassword(auth, email, pw);
        setMsg("Account created ✅");
      }
    } catch (err) {
      // err is unknown by default in TS; safely extract a message
      let text = "Error";
      if (err && typeof err === "object" && "message" in err) {
        const e = err as { message?: unknown };
        text = typeof e.message === "string" ? e.message : "Error";
      }
      setMsg(text);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-sm space-y-4">
        <h1 className="text-2xl font-bold">
          {mode === "signin" ? "Sign in" : "Create account"}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            className="w-full border p-2 rounded"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
          />
          <input
            className="w-full border p-2 rounded"
            placeholder="Password"
            type="password"
            value={pw}
            onChange={(e) => setPw(e.target.value)}
            autoComplete="current-password"
          />
          <button className="w-full border p-2 rounded font-semibold" type="submit">
            {mode === "signin" ? "Sign in" : "Sign up"}
          </button>
        </form>

        <div className="flex items-center justify-between text-sm">
          <button
            className="underline"
            onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
          >
            {mode === "signin" ? "Need an account? Sign up" : "Have an account? Sign in"}
          </button>

          <button className="underline" onClick={() => signOut(auth)}>
            Sign out
          </button>
        </div>

        {msg && <p className="text-sm">{msg}</p>}
      </div>
    </div>
  );
}


