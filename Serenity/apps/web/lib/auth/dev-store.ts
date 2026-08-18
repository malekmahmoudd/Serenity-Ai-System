export type StoredUser = {
  _id: string;
  name: string;
  email: string;
  password: string;
};

const usersByEmail = new Map<string, StoredUser>();
const sessions = new Map<string, string>();

export function createUser(
  name: string,
  email: string,
  password: string
): StoredUser {
  const normalized = email.toLowerCase();
  if (usersByEmail.has(normalized)) {
    throw new Error("An account with this email already exists.");
  }
  const user: StoredUser = {
    _id: crypto.randomUUID(),
    name,
    email: normalized,
    password,
  };
  usersByEmail.set(normalized, user);
  return user;
}

export function verifyLogin(email: string, password: string): StoredUser {
  const normalized = email.toLowerCase();
  const user = usersByEmail.get(normalized);
  if (!user || user.password !== password) {
    throw new Error("Invalid email or password.");
  }
  return user;
}

export function createSession(userId: string): string {
  const token = crypto.randomUUID();
  sessions.set(token, userId);
  return token;
}

export function getUserIdForToken(token: string): string | undefined {
  return sessions.get(token);
}

export function getUserById(id: string): StoredUser | undefined {
  for (const u of usersByEmail.values()) {
    if (u._id === id) return u;
  }
  return undefined;
}

export function destroySession(token: string): void {
  sessions.delete(token);
}
