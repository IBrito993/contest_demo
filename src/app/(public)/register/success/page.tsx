import Link from "next/link";

export default function RegisterSuccessPage() {
  return (
    <div className="max-w-xl mx-auto px-4 py-24 text-center">
      <div className="text-6xl mb-6">📧</div>
      <h1 className="text-3xl font-bold text-gray-800 mb-4">Check your email!</h1>
      <p className="text-gray-500 mb-8">
        We sent a verification link to your email address. Click it to confirm your
        registration. If you don&apos;t see it, check your spam folder.
      </p>
      <Link href="/" className="text-red-600 hover:underline font-medium">
        Back to Home
      </Link>
    </div>
  );
}
