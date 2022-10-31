import { PrismaClient } from "@prisma/client";

// To get more chances to reuse the connection,
// we create a new client instance here and allow others to import it.
// https://www.prisma.io/docs/guides/performance-and-optimization/connection-management#serverless-environments-faas
export const prisma = new PrismaClient();
