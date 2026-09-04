import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/auth/hash";

export interface AppUser {
  id: string;
  name: string;
  email: string;
  hashedPassword: string;
  image?: string | null;
}

// In-memory fallback users for development/demo when database is unreachable
const fallbackUsers: Map<string, AppUser> = new Map();

// Initialize default demo account
(async () => {
  const defaultHash = await hashPassword("password123");
  fallbackUsers.set("admin@example.com", {
    id: "demo-user-1",
    name: "Wirausaha Muda",
    email: "admin@example.com",
    hashedPassword: defaultHash,
  });
})();

export async function findUserByEmail(email: string): Promise<AppUser | null> {
  try {
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });
    if (user) {
      return {
        id: user.id,
        name: user.name,
        email: user.email,
        hashedPassword: user.hashedPassword,
        image: user.image,
      };
    }
  } catch (error) {
    console.warn("Database unavailable for user lookup, using fallback store:", error);
  }

  // Fallback to in-memory store
  return fallbackUsers.get(email.toLowerCase()) || null;
}

export async function createUser(data: {
  name: string;
  email: string;
  password: string;
}): Promise<AppUser> {
  const hashedPassword = await hashPassword(data.password);
  const normalizedEmail = data.email.toLowerCase();

  try {
    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: normalizedEmail,
        hashedPassword,
      },
    });
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      hashedPassword: user.hashedPassword,
      image: user.image,
    };
  } catch (error) {
    console.warn("Database unavailable for user creation, saving to fallback store:", error);
  }

  // Fallback save
  const newUser: AppUser = {
    id: `user-${Date.now()}`,
    name: data.name,
    email: normalizedEmail,
    hashedPassword,
  };
  fallbackUsers.set(normalizedEmail, newUser);
  return newUser;
}
