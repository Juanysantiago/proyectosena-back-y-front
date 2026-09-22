import axios from "axios";

export const axiosClient = axios.create({
  baseURL: "http://localhost:3000",
  withCredentials: true,
  timeout: 15000,
});

// ==========================================
// REQUEST
// ==========================================

axiosClient.interceptors.request.use(
  (config) => {

    // IMPORTANTE:
    // Si es FormData NO poner Content-Type manualmente.
    // Axios agrega automáticamente:
    // multipart/form-data; boundary=...

    if (config.data instanceof FormData) {

      if (config.headers) {
        delete config.headers["Content-Type"];
        delete config.headers["content-type"];
      }

    } else {

      config.headers = {
        ...config.headers,
        "Content-Type": "application/json",
      };
    }

    console.log(
      "➡️ REQUEST:",
      config.method?.toUpperCase(),
      `${config.baseURL}${config.url}`
    );

    return config;
  },

  (error) => {
    return Promise.reject(error);
  }
);

// ==========================================
// RESPONSE
// ==========================================

axiosClient.interceptors.response.use(

  (response) => {

    console.log(
      "✅ RESPONSE:",
      response.status,
      response.config.url
    );

    return response;
  },

  (error) => {

    if (error.response) {

      console.error(
        "❌ BACKEND ERROR:",
        error.response.status,
        error.response.data
      );

    } else if (error.request) {

      console.error(
        "❌ NETWORK ERROR: El backend no respondió"
      );

      console.error(
        "URL:",
        error.config?.baseURL +
        error.config?.url
      );

    } else {

      console.error(
        "❌ AXIOS ERROR:",
        error.message
      );
    }

    return Promise.reject(error);
  }
);