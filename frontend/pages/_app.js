

import { Provider } from "react-redux"; // Import Redux Provider
import store from "../redux/store"; // Import Redux store
import "../styles/globals.css";  // Global styles

function MyApp({ Component, pageProps }) {
  return (
    <Provider store={store}>
      <Component {...pageProps} /> {/* Wrap app in Redux provider */}
    </Provider>
  );
}

export default MyApp;
