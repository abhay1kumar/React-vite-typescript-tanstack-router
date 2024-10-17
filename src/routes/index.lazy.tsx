// import {
//   SignedIn,
//   SignedOut,
//   // SignIn,
//   SignInButton,
//   UserButton,
// } from "@clerk/clerk-react";
import { createLazyFileRoute } from "@tanstack/react-router";
import axios from "axios";
import WebcamDemo from "../components/FaceRecogantioni/WebcamDemo";
import { useState } from "react";

export const Route = createLazyFileRoute("/")({
  component: () => {
    return <HomeIndex />;
  },
});

const HomeIndex = () => {
  const [csvData, setCsvData] = useState("");

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const pdfData = await file.arrayBuffer();
    const response = await axios.post("http://localhost:3001/convert", {
      pdfData,
    });

    // console.log("response", response);
    setCsvData(response.data);
  };

  return (
    <div className="p-2">
      <div className="App">
        <input type="file" accept=".pdf" onChange={handleFileUpload} />
        <pre>{csvData}</pre>
      </div>
      <h3>Welcome Home!</h3>
      <WebcamDemo />

      {/* <SignIn.Strategy name="password">
        <h1>Enter your password</h1>

        <Clerk.Field name="password">
          <Clerk.Label>Password</Clerk.Label>
          <Clerk.Input />
          <Clerk.FieldError />
        </Clerk.Field>

        <SignIn.Action submit>Continue</SignIn.Action>
        <SignIn.Action navigate="forgot-password">
          Forgot password?
        </SignIn.Action>
      </SignIn.Strategy> */}
      {/* <SignIn /> */}
      {/* <SignedOut>
        <SignInButton />
      </SignedOut>
      <SignedIn>
        <UserButton />
      </SignedIn> */}
    </div>
  );
};
