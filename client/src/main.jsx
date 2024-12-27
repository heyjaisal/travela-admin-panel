import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux'; // Import the Provider to connect Redux
import './index.css';
import App from './App.jsx';
import store from './redux/store.jsx'; // Import your Redux store (adjust the path if needed)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}> {/* Provide the Redux store to your app */}
      <App />
    </Provider>
  </StrictMode>
);

