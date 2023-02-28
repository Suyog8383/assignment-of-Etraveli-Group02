import { configureStore } from "@reduxjs/toolkit";
import homeReducer from "./components/HomeReducer";

export const store = configureStore({
  reducer: {
    movies: homeReducer,
  },
});
