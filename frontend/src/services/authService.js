import API from "./api";

// LOGIN
export const loginUser = async ({ email, password }) => {
  const res = await API.post("/v1/auth/login", {
    email,
    password,
  });

  localStorage.setItem("accessToken", res.data.accessToken);
  localStorage.setItem("refreshToken", res.data.refreshToken);

  return res.data;
};

// REFRESH TOKEN (FIXED)
export const refreshToken = async () => {
  const refreshToken = localStorage.getItem("refreshToken");

  const res = await API.post("/v1/auth/refresh", {
    refreshToken,
  });

  localStorage.setItem("accessToken", res.data.accessToken);

  return res.data.accessToken;
};

// LOGOUT
export const logoutUser = async () => {
  const refreshToken = localStorage.getItem("refreshToken");

  await API.post("/v1/auth/logout", { refreshToken });

  localStorage.clear();
};
