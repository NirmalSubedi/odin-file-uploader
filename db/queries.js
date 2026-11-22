import { prisma } from "./prisma.js";

export const get_user = async (user_to_find) => {
  const { email } = user_to_find;
  const found_user = await prisma.user;
};
