import { Button } from "@/components/ui/button";
import { isRouteErrorResponse, Link, useRouteError } from "react-router";

const ErrorPage = () => {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center gap-2 text-center lg:gap-4">
        <div className="text-8xl font-bold">
          {error.status}
          <span className="text-primary">!</span>
        </div>
        <p>{error.statusText}</p>
        {error.data && (
          <pre>
            <code>{JSON.stringify(error.data, null, 2)}</code>
          </pre>
        )}
        <Button asChild>
          <Link to="/">Go back to Home</Link>
        </Button>
      </div>
    );
  }

  let errorMessage = "An unknown error occurred.";
  if (error instanceof Error) {
    errorMessage = error.message;
  }

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center gap-2 text-center lg:gap-4">
      <div className="text-4xl font-bold">
        Something went wrong
        <span className="text-primary">!</span>
      </div>
      <p>{errorMessage}</p>
      <Button asChild>
        <Link to="/">Go back to Home</Link>
      </Button>
    </div>
  );
};

export default ErrorPage;
