import Link from "next/link";

export default async function VerifyPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; token?: string }>;
}) {
  const { status, token } = await searchParams;

  if (token && !status) {
    const { redirect } = await import("next/navigation");
    redirect(`/api/verify?token=${token}`);
  }

  if (status === "success") {
    return (
      <div className="max-w-xl mx-auto px-4 py-24 text-center">
        <div className="text-6xl mb-6">✅</div>
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Email Verified!</h1>
        <p className="text-gray-500 mb-8">
          Your registration has been confirmed. We&apos;ll review your submission and get back to you soon.
        </p>
        <Link href="/" className="bg-red-600 text-white font-bold px-8 py-3 rounded-lg hover:bg-red-700 transition">
          Go to Home
        </Link>
      </div>
    );
  }

  if (status === "already") {
    return (
      <div className="max-w-xl mx-auto px-4 py-24 text-center">
        <div className="text-6xl mb-6">ℹ️</div>
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Already Verified</h1>
        <p className="text-gray-500 mb-8">Your email is already verified. No further action needed.</p>
        <Link href="/" className="text-red-600 hover:underline font-medium">Back to Home</Link>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-24 text-center">
      <div className="text-6xl mb-6">❌</div>
      <h1 className="text-3xl font-bold text-gray-800 mb-4">Invalid Link</h1>
      <p className="text-gray-500 mb-8">
        This verification link is invalid or has already been used.
      </p>
      <Link href="/register" className="text-red-600 hover:underline font-medium">Register again</Link>
    </div>
  );
}
