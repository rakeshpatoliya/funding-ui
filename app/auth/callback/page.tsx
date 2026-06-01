"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { createPublicOauthClient } from "@osdk/oauth";

// 1. Re-initialize the EXACT same auth client you have on your home page
const auth = createPublicOauthClient("43f28f760482c1799f0bd6b47945a25a", //client id
  "https://sanghavi.usw-17.palantirfoundry.com", //Foundry base url
  "http://localhost:3000/auth/callback", // Redirected URL Must match exactly what is in Foundry
  {
    postLoginPage: typeof window !== "undefined" ? window.location.toString() : "http://localhost:3000",
    scopes: [
      "api:read-data",
      "api:write-data",
      "api:aip-agents-read",
      "api:aip-agents-write"
    ]
  }
);

export default function AuthCallback() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  
  // React 18 Strict Mode runs useEffect twice. This ref prevents the 
  // login code from running twice and throwing an error.
  const hasAttemptedLogin = useRef(false);

  useEffect(() => {
    if (hasAttemptedLogin.current) return;
    hasAttemptedLogin.current = true;

    // 2. Process the login credentials from the URL
    auth.signIn()
      .then(() => {
        // 3. Success! Send the user back to the home page
        router.push("/");
      })
      .catch((err) => {
        console.error("Failed to sign in:", err);
        setError(err.message || "Failed to process login");
      });
  }, [router]);

  if (error) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-red-50 text-red-700">
        <p>Authentication Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full items-center justify-center">
      <p className="text-lg font-medium">Authenticating with Palantir... Please wait.</p>
    </div>
  );
}