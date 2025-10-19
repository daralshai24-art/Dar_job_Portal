// src/components/providers/SessionProvider.jsx
"use client";

import { SessionProvider as NextAuthSessionProvider } from "next-auth/react";

/**
 * Session Provider Wrapper
 * Must be a client component to use NextAuth hooks
 */
export default function SessionProvider({ children, session }) {
  return (
    <NextAuthSessionProvider session={session}>
      {children}
    </NextAuthSessionProvider>
  );
}