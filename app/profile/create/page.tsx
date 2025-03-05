"use client";

import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createProfileAction } from "@/app/actions/createProfileAction";


const CreatePage = () => {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!isLoaded) return;

    console.log("User Data:", user);

    if (user?.publicMetadata?.hasProfile) {
      router.replace("/");
    } else {
      setLoading(false);
    }
  }, [user, isLoaded, router]);

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <section className="flex justify-center items-start min-h-screen bg-gray-100 pt-16">
      <div className="bg-white shadow-xl rounded-lg p-8 w-full max-w-lg">
        <h1 className="text-3xl font-bold mb-7 text-center text-gray-800">
          Create Your Profile
        </h1>

        {errorMessage && <p className="text-red-500 text-center">{errorMessage}</p>}

        <form
          onSubmit={async (e) => {
            e.preventDefault();
            setErrorMessage("");

            const formData = new FormData(e.currentTarget);
            console.log("📤 Form Data:", Object.fromEntries(formData.entries())); // ✅ Debugging

            try {
              const response = await createProfileAction(formData);
              if (response?.error) {
                setErrorMessage(response.error);
              } else {
                console.log("✅ Profile created, redirecting...");
                router.replace("/");
              }
            } catch (error) {
              setErrorMessage("Server error. Please try again.");
              console.error("❌ Server error:", error);
            }
          }}
          className="space-y-4"
        >
          <input name="userName" placeholder="Username" required className="border p-2 w-full" />

          <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded">
            Create Profile
          </button>
        </form>
      </div>
    </section>
  );
};

export default CreatePage;
