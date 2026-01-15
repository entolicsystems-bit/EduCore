import API from "./api";

// LOGIN
export const loginUser = async ({ email, password }) => {
  const res = await API.post("/v1/auth/login", {
    email,
    password,
  });
  // console.log("Admin Response", res);
  localStorage.setItem("accessToken", res.data.accessToken);
  localStorage.setItem("refreshToken", res.data.refreshToken);

  // localStorage.setItem("user", JSON.stringify(user));
  return res.data;
};

// REFRESH TOKEN
export const refreshToken = async () => {
  // const accessToken = localStorage.getItem("accessToken");
  const refreshToken = localStorage.getItem("refreshToken");

  const res = await API.post("/v1/auth/refresh", {
    accessToken,
    refreshToken,
  });

  localStorage.setItem("accessToken", res.data.accessToken);
  // localStorage.setItem("refreshToken", res.data.refreshToken);

  return res.data;
};

// LOGOUT
export const logoutUser = async () => {
  const refreshToken = localStorage.getItem("refreshToken");

  await API.post("/v1/auth/logout", {
    refreshToken,
  });

  localStorage.clear();
};
