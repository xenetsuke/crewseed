import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";

import userReducer from "./features/UserSlice";
import profileReducer from "./features/ProfileSlice";
import jwtReducer from "./features/JwtSlice";
import authReducer from "./features/AuthSlice";

const rootReducer = combineReducers({
  user: userReducer,
  profile: profileReducer,
  jwt: jwtReducer,     // 🔥 persists raw + token
  auth: authReducer,   // ❌ NOT persisted
});

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["user", "profile", "jwt"], // ✅ correct
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // redux-persist
    }),
});

export const persistor = persistStore(store);
