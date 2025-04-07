import { apiRequest } from "./apiRequest";

type userLoginType = {
  email?: string;
  password: string;
  phone?: number;
};

export const userLogin = (credentials: userLoginType) => {
    return apiRequest("post", "/auth/login", credentials);
};

type userRegisterType = {
  email: string;
  password: string;
  phone: string;
  dob: string,
  articlePreferences: string[]
};

export const userRegister = (credentials: userRegisterType) => {
  return apiRequest("post", "/auth/register", credentials);
};
