'use client'
import { SignOutButton } from "@clerk/nextjs";
import { useToast } from "@/hooks/use-toast";

const SignOutLinks = () => {
  const { toast } = useToast();

  const handleLogout = () => {
    toast({ description: "Logout Successfully!" });
  };

  return (
    <SignOutButton redirectUrl="/">
      <button
        onClick={handleLogout}
        className="w-full text-left px-4 py-2 hover:bg-gray-100"
      >
        Logout
      </button>
    </SignOutButton>
  );
};

export default SignOutLinks;
