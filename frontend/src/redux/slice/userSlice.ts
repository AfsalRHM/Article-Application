import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  accessToken: "",
  userId: "",
  userMail: "",
  userPreference: [],
};

const userSlice = createSlice({
  name: "user data",
  initialState,
  reducers: {
    assignData: (state, action) => {
      state.accessToken = action.payload.accessToken;
      state.userId = action.payload.userId;
      state.userMail = action.payload.userMail;
      state.userPreference = action.payload.userPreference;
    },
    removeData: (state) => {
      state.accessToken = "";
      state.userId = "";
      state.userMail = "";
      state.userPreference = [];
    },
  },
});

export const { assignData, removeData } = userSlice.actions;

export default userSlice.reducer;
