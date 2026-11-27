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
  const id = Number(folder.id);
  const result = await prisma.folders.findFirst({
    where: { id },
    include: { files: true },
  });
  return result;
};

export const select_user_folders = async (user) => {
  const { email } = user;
  const { folders } = await prisma.users.findFirst({
    where: { email },
    include: { folders: true },
  });
  return folders;
};

export const update_folder = async (folder) => {
  const id = Number(folder.id);
  const { name, user_email } = folder;
  const result = await prisma.folders.update({
    where: { id, user_email },
    data: { name },
  });
  return result;
};

export const delete_folder = async (folder) => {
  const id = Number(folder.id);
  const { user_email } = folder;
  const result = await prisma.folders.delete({
    where: { id, user_email },
  });
  return result;
};

export const insert_file = async (file) => {
  const folder_id = Number(file.folder_id);
  const { name, size, upload_time } = file;
  const result = await prisma.files.create({
    data: { name, size, upload_time, folder_id },
  });
  return result;
};

export const select_file = async (file) => {
  const id = Number(file.id);
  const { email } = file;

  let result = await prisma.users.findFirst({
    select: {
      folders: {
        select: {
          files: {
            where: { id },
          },
        },
      },
    },
    where: { email },
  });

  // Unwrapping
  if (result) {
    const { folders } = result;
    const { files } = folders[0];
    result = files[0];
  }

  return result;
};
