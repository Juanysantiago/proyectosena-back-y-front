import axios from "axios";

export const axiosClient = axios.create({
  baseURL: "http://localhost:3000",
  withCredentials: true,
});

// ==========================================
// REQUEST INTERCEPTOR
// ==========================================

axiosClient.interceptors.request.use(
  (config) => {

    // Si estamos enviando FormData,
    // NO establecer application/json.
    //
    // Axios se encargará automáticamente
    // de colocar multipart/form-data
    // con su boundary correspondiente.

    if (config.data instanceof FormData) {
      delete config.headers["Content-Type"];
    } else {
      config.headers["Content-Type"] =
        "application/json";
    }

    return config;
  },

  (error) => {
    return Promise.reject(error);
  }
);

// ==========================================
// RESPONSE INTERCEPTOR
// ==========================================

axiosClient.interceptors.response.use(
  (response) => {
    return response;
  },

  (error) => {

    console.error(
      "❌ AXIOS ERROR:",
      error.response?.data || error.message
    );

    return Promise.reject(error);
  }
);