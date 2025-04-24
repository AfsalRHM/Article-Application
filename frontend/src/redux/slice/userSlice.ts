import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserState {
  userId: string;
  userMail: string;
  userPreference: string[];
  userToken?: string;
}

const initialState: UserState = {
  userId: "",
  userMail: "",
  userPreference: [],
  userToken: "",
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    assignData: (state, action: PayloadAction<UserState>) => {
      Object.assign(state, action.payload);
    },
    removeData: (state) => {
      Object.assign(state, initialState);
    },
  },
});

export const { assignData, removeData } = userSlice.actions;

export default userSlice.reducer;
