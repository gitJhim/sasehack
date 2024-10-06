import { useEffect, useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import {
  GoogleSignin,
  statusCodes,
} from "@react-native-google-signin/google-signin";
import { useUserStore } from "../state/stores/userStore";
import { Session } from "@supabase/supabase-js";
import { Ionicons } from "@expo/vector-icons";
import {
  doesUserExistById,
  insertNewUser,
  signInUserWithToken,
  updateUser,
} from "../utils/db/auth";

GoogleSignin.configure({
  webClientId:
    "156165157980-vq7nev50rl4agci83fksoj77pt4ufj1v.apps.googleusercontent.com",
  iosClientId:
    "156165157980-mr98u2molp7k41g51rsanfncuja8no5l.apps.googleusercontent.com",
});

export default function SignInPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [errorText, setErrorText] = useState("");
  const [initialized, setInitialized] = useState(false);

  const session = useUserStore((state) => state.session);
  const setUser = useUserStore((state) => state.setUser);

  const checkAndUpdateUser = async (session: Session) => {
    let checkUser: any;
    console.log("Checking and updating user...");
    try {
      console.log(session.user.id);
      const { user, error } = await doesUserExistById(session.user.id);

      if (error) {
        console.error("Error checking user:", error.message);
        setErrorText("Error checking user: " + error.message);
        return;
      }

      checkUser = user;

      console.log("Fetched user:", user);

      if (!user) {
        console.log("User not found, inserting new user...");

        const { user: data, error: insertError } = await insertNewUser(session);

        if (insertError) {
          console.error("Error adding user:", insertError.message);
          setErrorText("Error adding user: " + insertError.message);
          return;
        }

        checkUser = data;
        console.log("Inserted new user:", user);
      } else {
        console.log("User found, updating user...");
        const { user: updatedUser, error: updateError } =
          await updateUser(session);

        if (updateError) {
          console.error("Error updating user:", updateError.message);
          setErrorText("Error updating user: " + updateError.message);
          return;
        }

        checkUser = updatedUser?.length ? updatedUser[0] : null;
        console.log("Updated user:", checkUser);
      }

      if (!checkUser) {
        console.error("User is null after database operations.");
        setErrorText("User is null after database operations.");
        return;
      }

      console.log("User data set in store:", checkUser);
      setUser(checkUser);

      if (!checkUser.username) {
        console.log("Redirecting to /onboarding");
        router.navigate("/onboarding");
      } else {
        console.log("Redirecting to /profile");
        router.navigate("/profile");
      }
    } catch (error: any) {
      console.error("Unexpected error:", error);
      setErrorText("Unexpected error: " + error.message);
    }
  };

  useEffect(() => {
    const initialize = async () => {
      console.log("Initializing...");
      if (!initialized) {
        setInitialized(true);
        if (session) {
          console.log("Session found:", session);
          await checkAndUpdateUser(session);
        } else {
          console.log("No session found");
          setLoading(false);
        }
      }
    };

    initialize();
  }, [initialized]);

  return (
    <>
      <View className="flex-1 items-center justify-center bg-lightBackground dark:bg-darkBackground p-7">
        <TouchableOpacity
          onPress={async () => {
            try {
              await GoogleSignin.hasPlayServices();
              const userInfo: any = await GoogleSignin.signIn();
              if (userInfo.data.idToken) {
                const { data, error } = await signInUserWithToken(
                  userInfo.data.idToken,
                );
                if (error) {
                  console.error("Error signing in:", error.message);
                  setErrorText("Error signing in: " + error.message);
                } else {
                  if (data && data.session) {
                    await checkAndUpdateUser(data.session);
                  } else {
                    setErrorText(
                      "Error: No session data returned from sign-in.",
                    );
                  }
                }
              } else {
                throw new Error("No ID token present!");
              }
            } catch (error: any) {
              console.error("Sign in error:", error.message);
              if (error.code === statusCodes.SIGN_IN_CANCELLED) {
                setErrorText("User cancelled the login flow");
              } else if (error.code === statusCodes.IN_PROGRESS) {
                setErrorText("Operation (e.g. sign in) is in progress already");
              } else if (
                error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE
              ) {
                setErrorText("Play services not available or outdated");
              } else {
                setErrorText(error.message);
              }
            }
          }}
          className="h-12 mb-4 flex-row items-center justify-center bg-[#4285F4] rounded-2xl w-ful px-2"
        >
          <Ionicons name="logo-google" size={24} color="white" />
          <Text className="text-white text-lg ml-2">Sign in with Google</Text>
        </TouchableOpacity>
        <Text className="text-center text-xl text-red-500 font-bold">
          {errorText}
        </Text>
      </View>
    </>
  );
}
