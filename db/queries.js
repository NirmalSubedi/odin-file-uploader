import { prisma } from "./prisma.js";

export const insert_user = async (user) => {
  const result = await prisma.users.create({
    data: { ...user },
  });
  return result;
};
