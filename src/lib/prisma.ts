import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/generated/prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

let localPrisma: PrismaClient | undefined;

function createPrismaClient() {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error("A variável DATABASE_URL não foi configurada.");
  }

  const databaseUrl = new URL(connectionString);
  const sslMode = databaseUrl.searchParams.get("sslmode");

  if (sslMode && ["prefer", "require", "verify-ca"].includes(sslMode)) {
    databaseUrl.searchParams.set("sslmode", "verify-full");
  }

  const adapter = new PrismaPg({ connectionString: databaseUrl.toString() });
  return new PrismaClient({ adapter });
}

export const prisma =
  new Proxy({} as PrismaClient, {
    get(_target, property) {
      const client =
        globalForPrisma.prisma ?? localPrisma ?? createPrismaClient();

      localPrisma = client;
      if (process.env.NODE_ENV !== "production") {
        globalForPrisma.prisma = client;
      }

      const value = Reflect.get(client, property, client);
      return typeof value === "function" ? value.bind(client) : value;
    },
  });
