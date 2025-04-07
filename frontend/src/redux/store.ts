import storage from "redux-persist/lib/storage";

import userReducer from "./slice/userSlice";
import { configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";

const persistConfig: {
  key: string;
  version: number;
  storage: any;
} = {
  key: "root",
  version: 1,
  storage,
};

const persistedReducer = persistReducer(persistConfig, userReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);

// persistor.purge()

export type RootState = ReturnType<typeof userReducer>;
export type AppDispatch = typeof store.dispatch;
