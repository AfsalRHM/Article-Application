import axios from "axios";
import { assignData, removeData } from "../../redux/slice/userSlice";
import { refreshToken, userLogout } from "../authRequest";
import { store } from "../../redux/store";
import { showErrorToast } from "../../utils/iziToastUtils";

const setupInterceptors = (instance: ReturnType<typeof axios.create>) => {
  // Request Interceptor
  instance.interceptors.request.use(
    (config) => {
      const token = store.getState().user.userToken;

      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  // Response Interceptor
  instance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const { response } = error;
      const originalRequest = response?.config;

      const reduxData = store.getState().user;

      if (response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        try {
          const res = await refreshToken();
          const newAccessToken = res.accessToken;

          store.dispatch(
            assignData({ ...reduxData, userToken: newAccessToken })
          );

          originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
          return axios(originalRequest);
        } catch (err) {
          store.dispatch(removeData());
          userLogout();
          showErrorToast("Session Expired! Please SignIn...");
        }
      }

      return Promise.reject(error);
    }
  );
};

export default setupInterceptors;
