import React from "react";
import { Stack } from "expo-router";
import { useRouteInfo } from "expo-router/build/hooks";

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen
        name="Home"
        options={{
          headerShown: false,
          animation: "none",
        }}
      />
      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
          animation: "none",
        }}
      />
      <Stack.Screen
        name="Notification"
        options={{
          headerShown: false,
          animation: "none",
        }}
      />
      <Stack.Screen
        name="Recherche"
        options={{
          headerShown: false,

          animation: "none",
        }}
      />
      <Stack.Screen
        name="PostScreens"
        options={{
          headerShown: false,
          animation: "none",
        }}
      />
      <Stack.Screen
        name="Request"
        options={{
          headerShown: false,
          animation: "none",
        }}
      />
      <Stack.Screen
        name="Login"
        options={{
          headerShown: false,
          animation: "none",
        }}
      />
      <Stack.Screen
        name="Messages"
        options={{
          headerShown: true,
          animation: "none",
        }}
      />
      <Stack.Screen
        name="NewPost"
        options={{
          headerShown: false,
          animation: "none",
        }}
      />
      <Stack.Screen
        name="Parameter"
        options={{
          headerShown: false,
          animation: "slide_from_right",
        }}
      />
      <Stack.Screen
        name="Register"
        options={{
          headerShown: false,
          animation: "none",
        }}
      />
      <Stack.Screen
        name="Profil/[username]"
        options={{
          headerShown: false,
          animation: "slide_from_right",
        }}
      />
      <Stack.Screen
        name="Commentaire/[postId]"
        options={{
          headerShown: false,
          presentation: "transparentModal",
          animation: "slide_from_bottom",
        }}
      />
      <Stack.Screen
        name="SingleMessage/[room_name]"
        options={{
          headerShown: false,
          animation: "none",
        }}
        // redirect
      />
      <Stack.Screen
        name="SearchResult/[searchvalue]"
        options={{
          headerShown: false,
          animation: "none",
        }}
        // redirect
      />

      <Stack.Screen
        name="SavedPost"
        options={{
          headerShown: false,
          animation: "none",
        }}
      />
    </Stack>
  );
}
