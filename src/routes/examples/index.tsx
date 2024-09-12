import { createFileRoute } from "@tanstack/react-router";
import UserForm from "./-components/FormInput";

export const Route = createFileRoute("/examples/")({
  component: () => (
    <>
      <UserForm />
    </>
  ),
});
