import { prisma } from "./prisma.js";

export const insert_user = async (user) => {
  const { email, password } = user;
  const result = await prisma.users.create({
    data: { email, password },
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
