import { prisma } from "./prisma.js";

export const insert_user = async (user) => {
  const { email, password } = user;
  const result = await prisma.users.create({
    data: { email, password },
  });
  return result;
};

export const select_user = async (user_to_find) => {
  const { email } = user_to_find;
  const user = await prisma.users.findFirst({
    where: { email },
  });
  return user;
};

export const insert_folder = async (folder) => {
  const { name, user_email } = folder;
  const result = await prisma.folders.create({
    data: { name, user_email },
  });
  return result;
};

export const select_folder = async (folder) => {
  const { id } = folder;
  const result = await prisma.users.findFirst({
    where: { id },
  });
  return result;
};

export const update_folder = async (folder) => {
  const { name, id } = folder;
  const result = await prisma.users.update({
    where: { id },
    data: { name },
  });
  return result;
};
