import { combineReducers, configureStore } from "@reduxjs/toolkit";
import counterReducer from "./counter/counterSlice";
import accountReducer from "./account/accountSlice";
import orderReducer from "./order/orderSlice";
import addressReducer from "./address/addressSlice";

import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";

const persistConfig = {
  key: "root",
  version: 1,
  storage,
};

const rootReducer = combineReducers({
  counter: counterReducer,
  account: accountReducer,
  order: orderReducer,
  address: addressReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

let persistor = persistStore(store);
export type AppDispatch = typeof store.dispatch;
export { store, persistor };
