import { PrismaPg } from "@prisma/adapter-pg";
import { connectionString } from "../config.js";
import { PrismaClient } from "../generated/prisma/client.js";

const adapter = new PrismaPg({ connectionString });
export const prisma = new PrismaClient({ adapter });
