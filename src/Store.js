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
  jwt: jwtReducer,
  auth: authReducer, // 🔥 NEW
});

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["user", "profile", "jwt"], // ❌ DO NOT persist auth.ready
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});

export const persistor = persistStore(store);
