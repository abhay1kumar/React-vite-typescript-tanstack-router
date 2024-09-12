import { FormInput } from "../../../components/FormInput.component";
import { useState } from "react";

const validateEmail = (email: string) => {
  return email.includes("@") ? null : "Invalid email address";
};

const UserForm = () => {
  const [email, setEmail] = useState("");

  return (
    <form>
      <FormInput
        label="Email"
        type="email"
        name="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        validate={validateEmail}
      />
      <button type="submit">Submit</button>
    </form>
  );
};

export default UserForm;
