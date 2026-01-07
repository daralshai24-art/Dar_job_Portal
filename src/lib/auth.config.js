// src/lib/auth.config.js
import CredentialsProvider from "next-auth/providers/credentials";
import { connectDB } from "@/lib/db";
import User from "@/models/user";
import bcrypt from "bcryptjs";

/**
 * NextAuth Configuration
 * Handles authentication, session management, and callbacks
 */
export const authOptions = {
  // ==================== PROVIDERS ====================
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("البريد الإلكتروني وكلمة المرور مطلوبان");
        }

        try {
          await connectDB();

          // Find user with password field
          const user = await User.findOne({
            email: credentials.email.toLowerCase(),
          }).select("+password");

          if (!user) {
            throw new Error("البريد الإلكتروني أو كلمة المرور غير صحيحة");
          }

          // Check if account is locked
          if (user.isLocked()) {
            throw new Error("الحساب مقفل. حاول مرة أخرى بعد 5 دقيقة");
          }

          // Check if account is active
          if (user.status !== "active") {
            throw new Error("الحساب غير نشط. تواصل مع المسؤول");
          }

          // Verify password
          const isPasswordValid = await bcrypt.compare(
            credentials.password,
            user.password
          );

          if (!isPasswordValid) {
            // Increment login attempts
            user.loginAttempts = (user.loginAttempts || 0) + 1;

            // Lock account after 6 failed attempts
            if (user.loginAttempts >= 6) {
              user.lockUntil = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes
            }

            await user.save();
            throw new Error("البريد الإلكتروني أو كلمة المرور غير صحيحة");
          }

          // Success - Reset login attempts and update last login
          user.loginAttempts = 0;
          user.lockUntil = undefined;
          user.lastLogin = new Date();
          user.lastActivity = new Date();
          await user.save();

          // Return user data (without password)
          return {
            id: user._id.toString(),
            email: user.email,
            name: user.name,
            role: user.role,
            department: user.department,
            permissions: user.permissions,
            status: user.status,
            avatar: user.avatar,
            position: user.position,
          };
        } catch (error) {
          console.error("Auth error:", error);
          throw new Error(error.message || "فشل تسجيل الدخول");
        }
      },
    }),
  ],

  // ==================== SESSION CONFIGURATION ====================
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 24 hours (Best Practice)
    updateAge: 60 * 60, // Update session every hour
  },

  // ==================== PAGES ====================
  pages: {
    signIn: "/login",
    error: "/login",
    signOut: "/",
  },

  // ==================== CALLBACKS ====================
  callbacks: {
    /**
     * JWT Callback - Add user data to token
     */
    async jwt({ token, user, trigger, session }) {
      // Initial sign in
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.department = user.department;
        token.permissions = user.permissions;
        token.status = user.status;
        token.avatar = user.avatar;
        token.position = user.position;
      }

      // Handle session updates (when user data changes)
      if (trigger === "update" && session) {
        token = { ...token, ...session };
      }

      return token;
    },

    /**
     * Session Callback - Add token data to session
     */
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.department = token.department;
        session.user.permissions = token.permissions;
        session.user.status = token.status;
        session.user.avatar = token.avatar;
        session.user.position = token.position;
      }

      return session;
    },
  },

  // ==================== EVENTS ====================
  events: {
    async signIn({ user }) {
      console.log(`User signed in: ${user.email}`);
    },
    async signOut({ token }) {
      console.log(`User signed out: ${token.email}`);
    },
  },

  // ==================== DEBUG ====================
  debug: process.env.NODE_ENV === "development",

  // ==================== SECRET ====================
  secret: process.env.NEXTAUTH_SECRET,
};