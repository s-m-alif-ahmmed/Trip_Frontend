import { Link } from "react-router";
import { XCircle } from "lucide-react";

const BookingCancelPage = () => {
  return (
    <div className="min-h-[calc(100vh-96px)] bg-[#F4F6F8] flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-sm border border-[#DFE3E8] p-8 sm:p-12 flex flex-col items-center gap-6 max-w-md w-full text-center">
        <div className="bg-[#FFE7D9] rounded-full p-4">
          <XCircle className="size-12 text-[#B72136]" strokeWidth={1.5} />
        </div>

        <div className="flex flex-col gap-2">
          <h1 className="font-semibold text-[#212B36] text-2xl sm:text-[28px] leading-tight">
            Payment Not Complete
          </h1>
          <p className="text-[#637381] text-sm sm:text-base leading-6">
            Your payment was not completed successfully. Please try again later.
          </p>
        </div>

        <div className="h-px bg-[#DFE3E8] w-full" />

        <Link
          to="/"
          className="bg-[#122464] hover:bg-[#122464]/90 transition-colors text-white font-semibold text-sm sm:text-base rounded-xl px-8 py-3 w-full"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default BookingCancelPage;
