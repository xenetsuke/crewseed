import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";

import userReducer from "./features/UserSlice";
import profileReducer from "./features/ProfileSlice";
import jwtReducer from "./features/JwtSlice";

/* 1️⃣ Combine reducers */
const rootReducer = combineReducers({
  user: userReducer,
  profile: profileReducer,
  jwt: jwtReducer,
});

/* 2️⃣ Persist config */
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["user", "profile", "jwt"], // only persist important data
};

/* 3️⃣ Persisted reducer */
const persistedReducer = persistReducer(persistConfig, rootReducer);

/* 4️⃣ Configure store */
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // REQUIRED for redux-persist
    }),
});

/* 5️⃣ Persistor */
export const persistor = persistStore(store);
