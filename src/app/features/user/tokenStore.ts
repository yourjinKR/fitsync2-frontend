export const tokenStore = {
  
  setAccess: (token: string) => localStorage.setItem("accessToken", token),
  
  setRefresh: (token: string) => localStorage.setItem("refreshToken", token),
  
  clear: () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
  },
};