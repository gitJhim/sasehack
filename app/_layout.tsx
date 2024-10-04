import { AppState } from "react-native";
import { supabase } from "../utils/supabase";
import { useEffect } from "react";
import ErrorBoundary from "react-native-error-boundary";
import { Stack } from "expo-router";
import { useUserStore } from "../state/stores/userStore";

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
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  return (
    <>
      <ErrorBoundary>
        <Stack>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen
            name="profile"
            options={{ headerShown: false, animation: "none" }}
          />
        </Stack>
      </ErrorBoundary>
    </>
  );
}
