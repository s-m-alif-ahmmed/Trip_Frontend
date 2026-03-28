import { Button } from "@/components/ui/button";
import { Link } from "react-router";

const NotFoundError = () => {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center gap-2 text-center lg:gap-4">
      <div className="text-8xl font-bold">
        404
        <span className="text-primary">!</span>
      </div>
      <p>This page not found!</p>
      <Button asChild>
        <Link to="/">Go back to Home</Link>
      </Button>
    </div>
  );
};

export default NotFoundError;
