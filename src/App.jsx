import React, { useEffect, useState } from "react";
import Routes from "./Routes";
import { Provider, useSelector } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "./Store";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MantineProvider } from "@mantine/core";
import { ModalsProvider } from "@mantine/modals";
import { Notifications } from "@mantine/notifications";
import { Toaster } from "react-hot-toast";

import Preloader from "./components/Preloader";
import AppSkeleton from "./components/AppSkeleton";

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

function AppContent() {
  const token = useSelector((state) => state.jwt.token);
  const profile = useSelector((state) => state.profile);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // 🔓 Logged out → ready immediately
    if (!token) {
      setReady(true);
      return;
    }

    // 🔐 Logged in → wait for profile
    if (profile && profile.id) {
      setReady(true);
    }
  }, [token, profile]);

  if (!ready) {
    return <AppSkeleton />;
  }

  return <Routes />;
}
// 🔒 GLOBAL TAB-LEVEL PRELOADER FLAG (RUNS ONCE PER TAB)
const SHOULD_SHOW_PRELOADER = (() => {
  try {
    const nav = performance.getEntriesByType("navigation")[0];
    const isReload = nav?.type === "reload";

    // ❌ Never show on refresh
    if (isReload) return false;

    // ❌ Already shown in this tab
    if (sessionStorage.getItem("crewseed_preloader_shown")) {
      return false;
    }

    // ✅ First open in this tab
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

    const timer = setTimeout(() => {
      setShowPreloader(false);
    }, 7500); // ⏱️ GIF duration

    return () => clearTimeout(timer);
  }, [showPreloader]);

  if (showPreloader) {
    return <Preloader />;
  }

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
