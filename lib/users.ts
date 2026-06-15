import { promises as fs } from "fs";
import path from "path";
import bcrypt from "bcryptjs";

export type AppUser = {
  id: string;
  name: string;
  email: string;
  passwordHash?: string;
  provider: "credentials" | "google" | "naver";
  createdAt: string;
};

const usersPath = path.join(process.cwd(), "data", "users.json");

async function readUsers(): Promise<AppUser[]> {
  try {
    const file = await fs.readFile(usersPath, "utf8");
    return JSON.parse(file) as AppUser[];
  } catch {
    return [];
  }
}

async function writeUsers(users: AppUser[]) {
  await fs.mkdir(path.dirname(usersPath), { recursive: true });
  await fs.writeFile(usersPath, JSON.stringify(users, null, 2), "utf8");
}

export async function findUserByEmail(email: string) {
  const normalizedEmail = email.trim().toLowerCase();
  const users = await readUsers();
  return users.find((user) => user.email === normalizedEmail) ?? null;
}

export async function verifyCredentials(email: string, password: string) {
  const normalizedEmail = email.trim().toLowerCase();

  if (normalizedEmail === "demo@matjam.kr" && password === "demo1234") {
    return {
      id: "demo-user",
      name: "데모 사용자",
      email: normalizedEmail
    };
  }

  const user = await findUserByEmail(normalizedEmail);
  if (!user?.passwordHash) return null;

  const isValid = await bcrypt.compare(password, user.passwordHash);
  if (!isValid) return null;

  return {
    id: user.id,
    name: user.name,
    email: user.email
  };
}

export async function createCredentialsUser(input: {
  name: string;
  email: string;
  password: string;
}) {
  const email = input.email.trim().toLowerCase();
  const name = input.name.trim();
  const users = await readUsers();

  if (users.some((user) => user.email === email)) {
    throw new Error("이미 가입된 이메일입니다.");
  }

  const passwordHash = await bcrypt.hash(input.password, 10);
  const user: AppUser = {
    id: crypto.randomUUID(),
    name,
    email,
    passwordHash,
    provider: "credentials",
    createdAt: new Date().toISOString()
  };

  users.push(user);
  await writeUsers(users);

  return {
    id: user.id,
    name: user.name,
    email: user.email
  };
}

export async function upsertOAuthUser(input: {
  name?: string | null;
  email?: string | null;
  provider: "google" | "naver";
}) {
  if (!input.email) return null;

  const email = input.email.trim().toLowerCase();
  const users = await readUsers();
  const existing = users.find((user) => user.email === email);
  if (existing) return existing;

  const user: AppUser = {
    id: crypto.randomUUID(),
    name: input.name?.trim() || email.split("@")[0],
    email,
    provider: input.provider,
    createdAt: new Date().toISOString()
  };

  users.push(user);
  await writeUsers(users);
  return user;
}
