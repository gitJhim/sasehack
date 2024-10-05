import { Session } from "@supabase/supabase-js";
import { supabase } from "../supabase";

export const insertNewUser = async (session: Session) => {
  const { data, error } = await supabase
    .from("users")
    .insert([
      {
        id: session.user.id,
        email: session.user.email,
        name: session.user.user_metadata.full_name,
        avatar_url: session.user.user_metadata.avatar_url,
        last_sign_in: session.user.last_sign_in_at,
        school: null,
      },
    ])
    .select("*")
    .single();

  return { user: data, error };
};

export const signInUserWithToken = async (token: string) => {
  const { data, error } = await supabase.auth.signInWithIdToken({
    provider: "google",
    token: token,
  });

  return { data, error };
};

export const doesUserExistById = async (userId: string) => {
  const { data: users, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", userId);

  const user = users?.length ? users[0] : null;

  return { user, error };
};

export const updateUser = async (session: Session) => {
  const { data, error } = await supabase
    .from("users")
    .update({
      email: session.user.email,
      name: session.user.user_metadata.full_name,
      avatar_url: session.user.user_metadata.avatar_url,
      last_sign_in: session.user.last_sign_in_at,
    })
    .eq("id", session.user.id)
    .select("*");

  return { user: data, error };
};
