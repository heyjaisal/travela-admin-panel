// redux/store.jsx
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './reducers/authReducer';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // Local storage for persistence

const persistConfig = {
  key: 'root',
  storage,
};

const persistedReducer = persistReducer(persistConfig, authReducer);

const store = configureStore({
  reducer: {
    auth: persistedReducer, // Use persisted reducer
  },
});

const persistor = persistStore(store); // Create persistor

export { store, persistor };
