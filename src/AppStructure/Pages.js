import React from "react";

import AnimatedRoutes from "./AnimatedRoutes";

import { Amplify } from "aws-amplify";
import { Authenticator, Image, View, useTheme } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import awsExports from "../aws-exports";
import { I18n } from "aws-amplify";

// import { useSettingsStore } from "../Contexts/SettingsZustand";

// import { useNavigate } from "react-router-dom";


I18n.putVocabulariesForLanguage("en", {
  "Sign In": "Login", // Tab header
  "Sign in": "Log in", // Button label
  "Sign in to your account": "Welcome Back!",
  Username: "Enter your username (Might be your email)", // Username label
  Password: "Enter your password", // Password label
  "Forgot your password?": "Reset Password",
  "Create Account": "Create Account", // Tab header
  "Create a new account": "New User", // Header text
  "Confirm Password": "Confirm your password", // Confirm Password label
  Email: "Enter your email",
  "Phone Number": "Enter your phone number",
  "Code *": "Verification code has been sent to your email"
});

const components = {
  Header() {
    const { tokens } = useTheme();

    return (
      <View textAlign="center" padding={tokens.space.large}>
        <Image
          alt="Amplify logo"
          src="https://docs.amplify.aws/assets/logo-dark.svg"
        />
      </View>
    );
  },
};

Amplify.configure(awsExports);



function Pages() {


  return (
    <Authenticator
      components={components}
      signUpAttributes={["email", "name", "phone_number"]}
      hideSignUp={true}
    >
      {({ signOut, user }) => {
        return (
          <div className='main-block'>
            <AnimatedRoutes
              signOut={signOut}
              user={user}
            />
          </div>
        );
      }}
    </Authenticator>
  );
}

export default Pages;
