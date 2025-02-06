import axios from "axios";
const backendBaseURL = import.meta.env.VITE_BACKEND_BASE_URL;

export const client = axios.create({
  baseURL: backendBaseURL,
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

export const auth = axios.create({
  baseURL: backendBaseURL,
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

const getAccessToken = (): string | null => {
  return localStorage.getItem("access_token");
};

// ✅ 요청 인터셉터: 모든 요청에 액세스 토큰 추가
auth.interceptors.request.use(
  (config) => {
    const accessToken = getAccessToken();
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ✅ 액세스 토큰 자동 갱신
const refreshAccessToken = async () => {
  try {
    const response = await client.post("/users/token/refresh/");
    const newAccessToken = response.data.access_token;
    localStorage.setItem("access_token", newAccessToken);
    return newAccessToken;
  } catch {
    redirectToLoginPage();
  }
};

// ✅ 401 발생 시 자동으로 액세스 토큰 갱신 또는 로그인 페이지 이동
auth.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (error.response.status === 401 && !originalRequest._isRetry) {
      try {
        originalRequest._isRetry = true;
        const refreshedAccessToken = await refreshAccessToken();

        if (refreshedAccessToken) {
          originalRequest.headers.Authorization = `Bearer ${refreshedAccessToken}`;
          return auth(originalRequest);
        } else {
          redirectToLoginPage();
        }
      } catch {
        redirectToLoginPage();
      }
    }

    return Promise.reject(error);
  }
);

// ✅ 로그인 만료 시 자동으로 `/login`으로 이동하는 함수 설정
let redirectToLogin: () => void;

export const setRedirectFunction = (redirectFunction: () => void) => {
  redirectToLogin = redirectFunction;
};

export const redirectToLoginPage = () => {
  if (redirectToLogin) {
    redirectToLogin();
  }
};
