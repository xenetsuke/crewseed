import React from "react";
import Routes from "./Routes";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

import { store, persistor } from "./Store";

/* ✅ React Query */
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

/* Mantine UI */
import { MantineProvider } from "@mantine/core";
import { ModalsProvider } from "@mantine/modals";
import { Notifications } from "@mantine/notifications";

/* Toast */
import { Toaster } from "react-hot-toast";

/* ✅ Create Query Client (ONE TIME) */
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // 🚀 prevents refetch on tab switch
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 min default cache
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <MantineProvider defaultColorScheme="light">
            <Notifications position="top-right" />
            <ModalsProvider>
              <Routes />
              <Toaster position="top-center" reverseOrder={false} />
            </ModalsProvider>
          </MantineProvider>
        </PersistGate>
      </Provider>
    </QueryClientProvider>
  );
}

export default App;
