import { PrismaClient } from "@prisma/client";

export const prismaClient = new PrismaClient();
// this isnt te best, we should introduce a singleton here
