import { Button } from "../components/ui/button";
import { SignedIn, SignedOut, SignInButton, SignUpButton } from "@clerk/nextjs";
import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      {/* Hero Section */}
      <div className="max-w-3xl text-center space-y-4">
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
          The Perfect Vault for Your AI Conversations
        </h1>
        <p>
          Stop losing brilliant ideas and important answers in endless chat
          histories. With PromptVault, you can save, organize with folders and
          tags, and instantly find your most valuable AI interactions.
        </p>
      </div>

      {/* Call-to-Action Buttons */}
      <div className="mt-8">
        {/* This content is only shown to users who are not logged in. */}
        <SignedOut>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <SignInButton mode="modal">
              <Button size="lg">Go to Vault</Button>
            </SignInButton>
            <SignUpButton mode="modal">
              <Button asChild size="lg" variant="secondary">
                Get Started - It&apos;s Free
              </Button>
            </SignUpButton>
          </div>
        </SignedOut>

        {/* This content is only shown to users that are signed in. */}
        <SignedIn>
          <Button asChild size="lg">
            <Link href={"/dashboard"}>Go to Vault</Link>
          </Button>
        </SignedIn>
      </div>
    </div>
  );
}
