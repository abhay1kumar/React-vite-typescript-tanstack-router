import { useSignUp } from "@clerk/clerk-react";
import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/about")({
  component: About,
});

function About() {
  const { signUp } = useSignUp();

  const createUser = async () => {
    try {
      const res = await signUp?.create({
        emailAddress: "kumarabhay401@gmail.com",
        password: "Test@123",
        firstName: "Abhay",
        lastName: "KKK",
      });

      console.log("ressss", res);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="p-2">
      <button onClick={createUser}>Create Me</button>
    </div>
  );
}
