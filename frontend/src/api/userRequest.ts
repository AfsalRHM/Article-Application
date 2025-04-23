import { apiRequest } from "./apiRequest";

type getUserDataType = {
  userId: string;
};

export const getUserData = (data: getUserDataType) => {
  return apiRequest("get", `/users/${data.userId}`);
};

type updateUserProfileType = {
  userId: string;
  data: any;
};

export const updateUserProfile = (data: updateUserProfileType) => {
  return apiRequest("patch", `/users/${data.userId}/profile`, data);
};

type updateUserPasswordType = {
  userId: string;
  data: {
    currentPassword: string;
    newPassword: string;
  };
};

export const updateUserPassword = (data: updateUserPasswordType) => {
  return apiRequest("patch", `/users/${data.userId}/password`, data);
};

type updateUserPreferenceType = {
  userId: string;
  selectedCategories: string[];
};

export const updateUserPreference = (data: updateUserPreferenceType) => {
  return apiRequest("patch", `/users/${data.userId}/preference`, data);
};
