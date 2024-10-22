import axios from "axios";
import { inject } from "vue";

import { cookies } from "@/helper/cookies";
import { useCookies } from "vue3-cookies";

// Set config defaults when creating the instance

const api = async () => {
  const { cookies: cookie } = useCookies();

  try {
    const instance = axios.create({
      baseURL: import.meta.env.VITE_BASE_URL,
      headers: {
        "Content-type": "application/json",
        Accept: "multipart/formdata",
        "ngrok-skip-browser-warning": true,
      },
    });

    instance.interceptors.request.use(
      (request) => {
        const token = cookies("auth");
        if (token) {
          request.headers["Authorization"] = `Bearer ${token}`;
        }
        return request;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    instance.interceptors.response.use(
      (response) => {
        // do something i.e. return data object
        return response.data;
      },
      async (error) => {
        let originalRequest = error.config;

        if (error?.response?.status === 400) {
          // Handle forbidden error e.g. show restricted access warning
          return error;
        }

        if (error?.response?.status === 404) {
          // Handle forbidden error e.g. show restricted access warning
          return error;
        }

        if (error?.message === "Network Error") {
          return { statusCode: 503 };
        }

        if (error?.response?.status === 401) {
          // originalRequest._retry = true;

          // try {
          //   const refreshToken = cookies("refresh");
          //   const response = await axios.post(
          //     `${import.meta.env.VITE_BASE_URL}auth/refresh-token`,
          //     {
          //       refreshToken: refreshToken,
          //     }
          //   );

          //   cookie.set("auth", response?.data?.data?.access_token);
          //   cookie.set("refresh", response?.data?.data?.refresh_token);

          //   instance.defaults.headers.common[
          //     "Authorization"
          //   ] = `Bearer ${response?.data?.data?.access_token}`;

          //   return instance(originalRequest);
          // } catch (error) {
          //   cookie.remove("auth");
          //   cookie.remove("refresh");

          //   window.location.href = "/";
          // }

          cookie.remove("auth");

          window.location.href = "/";
          return Promise.reject(error);

          // Handle unauthorized error e.g. refresh and set token in storage
        }

        throw error; // forward other client errors
      }
    );

    return Promise.resolve(instance);
  } catch (err) {
    return Promise.reject(err);
  }
};

// Alter defaults after instance has been created
//instance.defaults.headers.common['Authorization'] = AUTH_TOKEN;

export default api;
