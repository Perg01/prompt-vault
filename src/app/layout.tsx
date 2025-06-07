import { type Metadata } from "next";
import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/src/components/theme-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PromptVault",
  description: "Your personal AI prompt library",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            <header
              style={{
                padding: "1rem",
                borderBottom: "1px solid #eee",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <h1>PromptVault</h1>
              <div>
                <SignedOut>
                  <SignInButton mode="modal">
                    {/* You can customize the button, e.g., by wrapping a custom button component */}
                    <button
                      style={{ marginRight: "0.5rem", padding: "0.5rem 1rem" }}
                    >
                      Sign In
                    </button>
                  </SignInButton>
                  <SignUpButton mode="modal">
                    <button style={{ padding: "0.5rem 1rem" }}>Sign Up</button>
                  </SignUpButton>
                </SignedOut>
                <SignedIn>
                  <UserButton afterSignOutUrl="/" />
                </SignedIn>
              </div>
            </header>
            <main style={{ padding: "1rem" }}>{children}</main>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
