import "react-native-url-polyfill/auto";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  "https://ndgftfjlbspdgccloeeo.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5kZ2Z0ZmpsYnNwZGdjY2xvZWVvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjgwNzcyOTYsImV4cCI6MjA0MzY1MzI5Nn0.MDJtJm3TSEMitOCCTUmo_Ewtmx-5VaX8q_LJWE2mleA",
  {
    auth: {
      storage: AsyncStorage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  },
);
