export default function PaymentCancelPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-black to-gray-900">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-red-500 mb-4">Payment Cancelled</h1>
        <p className="text-white/70 mb-8">Your payment was cancelled. Please try again.</p>
        <a 
          href="/"
          className="inline-flex items-center rounded-full bg-white/10 px-8 py-3 text-base font-semibold text-white transition-all hover:bg-white/20"
        >
          Return Home
        </a>
      </div>
    </div>
  );
} 