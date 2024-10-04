import { AppState } from "react-native";
import { supabase } from "../utils/supabase";
import { useEffect } from "react";
import ErrorBoundary from "react-native-error-boundary";
import { Stack } from "expo-router";

AppState.addEventListener("change", (state) => {
  if (state === "active") {
    supabase.auth.startAutoRefresh();
  } else {
    supabase.auth.stopAutoRefresh();
  }
});

export default function AppLayout() {
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {});

    supabase.auth.onAuthStateChange((_event, session) => {});
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
