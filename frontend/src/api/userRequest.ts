import { apiPrivate } from "./private/apiPrivate";

type getUserDataType = {
  userId: string;
};

export const getUserData = (data: getUserDataType) => {
  return apiPrivate("get", `/users/${data.userId}`);
};

type updateUserProfileType = {
  userId: string;
  data: any;
};

export const updateUserProfile = (data: updateUserProfileType) => {
  return apiPrivate("patch", `/users/${data.userId}/profile`, data);
};

type updateUserPasswordType = {
  userId: string;
  data: {
    currentPassword: string;
    newPassword: string;
  };
};

export const updateUserPassword = (data: updateUserPasswordType) => {
  return apiPrivate("patch", `/users/${data.userId}/password`, data);
};

type updateUserPreferenceType = {
  userId: string;
  selectedCategories: string[];
};

export const updateUserPreference = (data: updateUserPreferenceType) => {
  return apiPrivate("patch", `/users/${data.userId}/preference`, data);
};
