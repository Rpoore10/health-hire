"use client";
import { useState } from "react";
import { auth } from "@/lib/firebase";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";

export default function AuthPage() {
  const [mode, setMode] = useState<"signin"|"signup">("signin");
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
    } catch (err: any) {
      setMsg(err?.message || "Error");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-sm space-y-4">
        <h1 className="text-2xl font-bold">
          {mode === "signin" ? "Sign in" : "Create account"}
        </h1>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input className="w-full border p-2 rounded" placeholder="Email"
            value={email} onChange={e=>setEmail(e.target.value)} />
          <input className="w-full border p-2 rounded" placeholder="Password"
            type="password" value={pw} onChange={e=>setPw(e.target.value)} />
          <button className="w-full border p-2 rounded font-semibold" type="submit">
            {mode === "signin" ? "Sign in" : "Sign up"}
          </button>
        </form>
        <button className="text-sm underline" onClick={()=>
          setMode(mode === "signin" ? "signup" : "signin")}>
          {mode === "signin" ? "Need an account? Sign up" : "Have an account? Sign in"}
        </button>
        {msg && <p className="text-sm">{msg}</p>}
      </div>
    </div>
  );
}
