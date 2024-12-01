import { PrismaClient } from "@prisma/client";

export const prismaClient = new PrismaClient({
  log: ["warn", "error"],
});
// this isnt te best, we should introduce a singleton here
