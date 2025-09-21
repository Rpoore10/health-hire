"use client";

import { useState } from "react";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
} from "firebase/auth";
import { auth } from "../../lib/firebase";
import { ensureEmployerProfile } from "../../lib/createProfile";

function mapFirebaseError(code?: string): string {
  switch (code) {
    case "auth/email-already-in-use": return "Email already in use. Try signing in instead.";
    case "auth/invalid-email": return "That email doesn’t look right.";
    case "auth/weak-password": return "Password should be at least 6 characters.";
    case "auth/wrong-password": return "Incorrect password. Try again or reset it.";
    case "auth/user-not-found": return "No account with that email. Try signing up.";
    case "auth/too-many-requests": return "Too many attempts. Please wait a minute and try again.";
    default: return "Something went wrong. Please try again.";
  }
}

export default function AuthPage() {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [msg, setMsg] = useState("");
  const [info, setInfo] = useState("");

  async function afterAuth() {
    const u = auth.currentUser;
    if (u) {
      // pass undefined (not null) to satisfy types
      await ensureEmployerProfile(u.uid, u.email ?? undefined);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMsg(""); setInfo("");
    try {
      if (mode === "signin") {
        await signInWithEmailAndPassword(auth, email, pw);
        await afterAuth();
        setInfo("Signed in ✅");
      } else {
        await createUserWithEmailAndPassword(auth, email, pw);
        await afterAuth();
        setInfo("Account created ✅ You’re signed in.");
      }
    } catch (err) {
      let code: string | undefined;
      if (err && typeof err === "object" && "code" in err) {
        const e = err as { code?: unknown };
        code = typeof e.code === "string" ? e.code : undefined;
      }
      if (code === "auth/email-already-in-use" && mode === "signup") setMode("signin");
      setMsg(mapFirebaseError(code));
    }
  }

  async function handleReset() {
    setMsg(""); setInfo("");
    try {
      if (!email) { setMsg("Enter your email first, then click ‘Forgot password’."); return; }
      await sendPasswordResetEmail(auth, email);
      setInfo("Password reset email sent. Check your inbox.");
    } catch (err) {
      let code: string | undefined;
      if (err && typeof err === "object" && "code" in err) {
        const e = err as { code?: unknown };
        code = typeof e.code === "string" ? e.code : undefined;
      }
      setMsg(mapFirebaseError(code));
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-sm space-y-4">
        <h1 className="text-2xl font-bold">{mode === "signin" ? "Sign in" : "Create account"}</h1>

        <form onSubmit={handleSubmit} className="space-y-3">
          <input className="w-full border p-2 rounded" placeholder="Email"
            value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" />
          <input className="w-full border p-2 rounded" placeholder="Password" type="password"
            value={pw} onChange={(e) => setPw(e.target.value)}
            autoComplete={mode === "signin" ? "current-password" : "new-password"} />
          <button className="w-full border p-2 rounded font-semibold" type="submit">
            {mode === "signin" ? "Sign in" : "Sign up"}
          </button>
        </form>

        <div className="flex items-center justify-between text-sm">
          <button className="underline" onClick={() => { setMsg(""); setInfo(""); setMode(mode === "signin" ? "signup" : "signin"); }}>
            {mode === "signin" ? "Need an account? Sign up" : "Have an account? Sign in"}
          </button>
          <button className="underline" onClick={handleReset}>Forgot password?</button>
        </div>

        <div className="flex items-center justify-between text-sm">
          <a className="underline" href="/employer/jobs/new">Post a Job</a>
          <a className="underline" href="/employer/jobs">My Jobs</a>
          <a className="underline" href="/jobs">All Jobs</a>
          <button className="underline" onClick={() => signOut(auth)}>Sign out</button>
        </div>

        {msg && <p className="text-sm text-red-600">{msg}</p>}
        {info && <p className="text-sm text-green-700">{info}</p>}
      </div>
    </div>
  );
}






