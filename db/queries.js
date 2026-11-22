import { prisma } from "./prisma.js";

export const insert_user = async (user) => {
  const result = await prisma.users.create({
    data: { ...user },
  });
  return result;
};

export const get_user = async (user_to_find) => {
  const { email } = user_to_find;
  const user = await prisma.users.findFirst({
    where: { email },
  });
  return user;
};
