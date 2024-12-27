import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux'; 
import { PersistGate } from 'redux-persist/integration/react'; // Import the Provider to connect Redux
import './index.css';
import App from './App.jsx';
import {store,persistor} from './redux/store.jsx'; // Import your Redux store (adjust the path if needed)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <App />
      </PersistGate>
    </Provider>
  </StrictMode>
);

