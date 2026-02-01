import React, { useEffect, useState } from "react";
import Routes from "./Routes";
import { Provider, useDispatch, useSelector } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "./Store";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MantineProvider } from "@mantine/core";
import { ModalsProvider } from "@mantine/modals";
import { Notifications } from "@mantine/notifications";
import { Toaster } from "react-hot-toast";

import Preloader from "./components/Preloader";
import AppSkeleton from "./components/AppSkeleton";
import "./i18n";

import { bootstrapAuth } from "./Services/AuthBootstrap";

/* ✅ React Query Client */
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000,
    },
  },
});

/* =====================================================
   🔐 AUTH BOOTSTRAP WRAPPER
===================================================== */
function AppContent() {
  const dispatch = useDispatch();
  const authReady = useSelector((state) => state.auth.ready);

  useEffect(() => {
    bootstrapAuth(dispatch);
  }, [dispatch]);

  if (!authReady) {
    return <AppSkeleton />;
  }

  return <Routes />;
}

/* =====================================================
   🔒 TAB-LEVEL PRELOADER (UNCHANGED)
===================================================== */
const SHOULD_SHOW_PRELOADER = (() => {
  try {
    const nav = performance.getEntriesByType("navigation")[0];
    if (nav?.type === "reload") return false;

    if (sessionStorage.getItem("crewseed_preloader_shown")) return false;

    sessionStorage.setItem("crewseed_preloader_shown", "true");
    return true;
  } catch {
    return false;
  }
})();

function App() {
  const [showPreloader, setShowPreloader] = useState(SHOULD_SHOW_PRELOADER);

  useEffect(() => {
    if (!showPreloader) return;
    const timer = setTimeout(() => setShowPreloader(false), 7500);
    return () => clearTimeout(timer);
  }, [showPreloader]);

  if (showPreloader) return <Preloader />;

  return (
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <PersistGate loading={<AppSkeleton />} persistor={persistor}>
          <MantineProvider defaultColorScheme="light">
            <Notifications position="top-right" />
            <ModalsProvider>
              <AppContent />
              <Toaster position="top-center" />
            </ModalsProvider>
          </MantineProvider>
        </PersistGate>
      </Provider>
    </QueryClientProvider>
  );
}

export default App;
