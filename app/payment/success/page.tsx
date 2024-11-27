export default function PaymentSuccessPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-black to-gray-900">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-green-500 mb-4">Payment Successful!</h1>
        <p className="text-white/70 mb-8">Thank you for your purchase.</p>
        <a 
          href="/"
          className="inline-flex items-center rounded-full bg-green-500 px-8 py-3 text-base font-semibold text-white transition-all hover:bg-green-600"
        >
          Return Home
        </a>
      </div>
    </div>
  );
} 