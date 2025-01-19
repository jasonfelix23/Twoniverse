import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosRequestHeaders,
  InternalAxiosRequestConfig,
} from "axios";

class ApiService {
  private client: AxiosInstance;
  private token: string | null = null;

  constructor(baseURL: string) {
    this.client = axios.create({
      baseURL,
      headers: {
        "Content-Type": "application/json",
      },
    });

    //Interceptor to include the token in headers
    this.client.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        if (this.token) {
          config.headers = config.headers || {};
          config.headers.Authorization = `Bearer ${this.token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );
  }

  // Set token for subsequent requests
  setToken(token: string) {
    this.token = token;
  }

  // Clear token (e.g., during logout)
  clearToken() {
    this.token = null;
  }

  //GET Request
  async get<T>(url: string, params?: object): Promise<T> {
    const response = await this.client.get(url, { params });
    return response.data;
  }

  //POST Request
  async post<T>(url: string, body: object): Promise<T> {
    const response = await this.client.post(url, body);
    console.log(response.status);
    return response.data;
  }

  //PUT Request
  async put<T>(url: string, body: object): Promise<T> {
    const response = await this.client.put(url, body);
    return response.data;
  }

  //DELETE Request
  async delete<T>(url: string): Promise<T> {
    const response = await this.client.delete(url);
    return response.data;
  }
}

export default ApiService;
