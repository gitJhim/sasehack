import "../global.css";
import "expo-dev-client";
import { Stack } from "expo-router";
import { useEffect } from "react";
import { AppState } from "react-native";
import { supabase } from "../utils/supabase";
import { Navigator } from "../components/Navigator";
import { useUserStore } from "../state/stores/userStore";
import ErrorBoundary from "react-native-error-boundary";
import { checkAndUpdateUser } from "../utils/db/auth";

AppState.addEventListener("change", (state) => {
  if (state === "active") {
    supabase.auth.startAutoRefresh();
  } else {
    supabase.auth.stopAutoRefresh();
  }
});

export default function AppLayout() {
  const setSession = useUserStore((state) => state.setSession);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      checkAndUpdateUser(session);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      checkAndUpdateUser(session);
    });
  }, []);

  return (
    <>
      <ErrorBoundary>
        <Stack>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="profile" options={{ headerShown: false }} />
        </Stack>
        <Navigator />
      </ErrorBoundary>
    </>
  );
}
