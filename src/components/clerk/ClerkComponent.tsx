import {
  OrganizationList,
  SignedIn,
  SignedOut,
  SignIn,
  UserProfile,
} from "@clerk/clerk-react";

const ClerkComponent = () => {

  return (
    <div>
      <SignedOut>
        <SignIn />
        {/* <OrganizationList /> */}
      </SignedOut>
      <SignedIn>
        <UserProfile />
        <OrganizationList afterCreateOrganizationUrl={'/'} />
      </SignedIn>
    </div>
  );
};

export default ClerkComponent;
