import ApiService from "./ApiService";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8081/api/v1";

const apiService = new ApiService(BASE_URL);

// Utility functions to build API urls
const apiUtils = {
  loginUrl: () => `/auth/login`,
  signupUrl: () => `/auth/signup`,
  ping: () => `/ping`,
};

export { apiService, apiUtils };
