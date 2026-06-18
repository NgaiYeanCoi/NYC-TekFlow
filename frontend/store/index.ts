import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { uiReducer } from "@/store/ui-slice";

const rootReducer = combineReducers({
  ui: uiReducer,
});

const persistedReducer = persistReducer(
  {
    key: "tekflow",
    version: 1,
    storage,
    whitelist: ["ui"],
  },
  rootReducer,
);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

