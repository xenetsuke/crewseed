import React from "react";
import Routes from "./Routes";
import { Provider } from "react-redux";
import store from "./Store";

// Mantine UI Imports
import { MantineProvider } from "@mantine/core";
import { ModalsProvider } from "@mantine/modals";
import { Notifications } from "@mantine/notifications";

// Your toast popup
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <Provider store={store}>
      <MantineProvider defaultColorScheme="light">
        <Notifications position="top-right" />
        <ModalsProvider>

          {/* All app routing */}
          <Routes />

          <Toaster position="top-center" reverseOrder={false} />

        </ModalsProvider>
      </MantineProvider>
    </Provider>
  );
}

export default App;
