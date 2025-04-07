import { apiRequest } from "./apiRequest";

type getUserDataType = {
  userId: string;
};

export const getUserData = (data: getUserDataType) => {
  return apiRequest("post", "/user/get-user-data", data);
};

type updateUserProfileType = {
  userId: string;
  data: any;
};

export const updateUserProfile = (data: updateUserProfileType) => {
  return apiRequest("patch", "/user/update-user-profile-data", data);
};

type updateUserPasswordType = {
  userId: string;
  data: {
    currentPassword: string;
    newPassword: string;
  };
};

export const updateUserPassword = (data: updateUserPasswordType) => {
  return apiRequest("patch", "/user/update-user-password-data", data);
};

type updateUserPreferenceType = {
  userId: string;
  selectedCategories: string[];
};

export const updateUserPreference = (data: updateUserPreferenceType) => {
  return apiRequest("patch", "/user/update-user-preference-data", data);
};
