export const createAuthSlice = (set) => ({
  userInfo: null,
  setUserInfo: (userInfo) => {
    console.log("Setting userInfo in Zustand...");
    set({ userInfo });
  },
});
