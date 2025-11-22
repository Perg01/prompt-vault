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

      {/* --- UPDATED "HOW IT WORKS" SECTION --- */}
      <div className="mt-20 pt-10 border-t w-full max-w-5xl">
        <h2 className="text-3xl font-bold tracking-tight mb-8">
          How to Get Started
        </h2>
        {/* Using a 3-column grid for better alignment */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {/* Step 1: Sign In */}
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-primary text-primary-foreground font-bold text-2xl">
              1
            </div>
            <div className="text-left">
              <h3 className="font-semibold text-lg">Sign In to PromptVault</h3>
              <p className="text-muted-foreground">
                Create your account and keep the PromptVault tab open in your
                browser.
              </p>
            </div>
          </div>

          {/* Step 2: Install Extension */}
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-primary text-primary-foreground font-bold text-2xl">
              2
            </div>
            <div className="text-left">
              <h3 className="font-semibold text-lg">Install the Extension</h3>
              <Button asChild variant="outline" className="mt-1">
                <a
                  href="#https://chromewebstore.google.com/detail/promptvault-saver/pcjicojgipiplahpgmealahcidgdpiil"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Download from Chrome Store
                </a>
              </Button>
            </div>
          </div>

          {/* Step 3: Save Your Chats */}
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-primary text-primary-foreground font-bold text-2xl">
              3
            </div>
            <div className="text-left">
              <h3 className="font-semibold text-lg">Save from ChatGPT</h3>
              <p className="text-muted-foreground">
                Click the &quot;Save to PromptVault&quot; button in ChatGPT,
                edit the details in the popup, and save!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
