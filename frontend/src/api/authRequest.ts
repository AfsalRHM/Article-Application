import apiPublic from "./public/apiPublic";

type userLoginType = {
  email?: string;
  password: string;
  phone?: number;
};

export const userLogin = (credentials: userLoginType) => {
  return apiPublic("post", "/auths/login", credentials);
};

type userRegisterType = {
  email: string;
  password: string;
  phone: string;
  dob: string;
  articlePreferences: string[];
};

export const userRegister = (credentials: userRegisterType) => {
  return apiPublic("post", "/auths/register", credentials);
};

export const refreshToken = () => {
  return apiPublic("post", "/auths/refresh-token");
};

export const userLogout = () => {
  return apiPublic("post", "/auths/logout");
};
