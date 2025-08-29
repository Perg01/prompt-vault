export default function PrivacyPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      {/* Hero Section */}
      <div className="max-w-3xl text-center space-y-4">
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
          Privacy Policy for PromptVault Extension
        </h1>

        <h2>What We Collect</h2>
        <ul>
          <li>- ChatGPT conversations that you choose to save</li>
          <li>- Your PromptVault account information</li>
          <li>- Basic usage data to keep the extension working</li>
        </ul>

        <h2>How We Use Your Data</h2>
        <ul>
          <li>- Save your conversations to your PromptVault account</li>
          <li>- Keep your logged in</li>
          <li>- Make the extension work properly</li>
        </ul>

        <h2>What We Don&apos;t Do</h2>
        <ul>
          <li>- We don&apos;t read conversations you don&apos;t save</li>
          <li>- We don&apos;t share your data with anyone</li>
          <li>- We don&apos;t sell your information</li>
        </ul>

        <h2>Your Data</h2>
        <ul>
          <li>- Only you can see your saved conversations</li>
          <li>- You can delete your data anytime</li>
          <li>- Your conversations are stored securely</li>
        </ul>

        <h2>Extension Permissions</h2>
        <ul>
          <li>- ChatGPT access: To add the save button</li>
          <li>- PromptVault access: To save your conversations</li>
          <li>- To remember your settings</li>
          <li>- TO keep you logged in</li>
        </ul>

        <h2>Contact</h2>
        <p>
          If you have any questions or concerns about our privacy policy, please
          contact us at Syberjazpc@gmail.com
        </p>

        <h2>Changes</h2>
        <p>
          We reserve the right to update or modify this privacy policy at any
          time. Any changes will be effective immediately upon posting the
          updated policy on our website. By using the extension, you agree to
          this privacy policy.
        </p>
      </div>
    </div>
  );
}
