import { configureStore } from "@reduxjs/toolkit";

import userReducer from "./features/UserSlice";
import profileReducer from "./features/ProfileSlice";
// import filterReducer from "./Slices/FilterSlice";
// import sortReducer from "./Slices/SortSlice";
import jwtReducer from "./features/JwtSlice";
// import overlayReducer from "./Slices/OverlaySlice";

const store = configureStore({
  reducer: {
    user: userReducer,
    profile: profileReducer,
    // filter: filterReducer,
    // sort: sortReducer,
    jwt: jwtReducer
    // overlay: overlayReducer,
  },
});

export default store;
