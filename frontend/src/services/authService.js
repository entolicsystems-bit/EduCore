export const loginUser = async ({ email, password }) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (email && password) {
        resolve({
          token: "dummy-token-123",
          user: { email },
        });
      } else {
        reject(new Error("Invalid credentials"));
      }
    }, 800);
  });
};
