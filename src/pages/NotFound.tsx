import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted">
      <div className="text-center">
        <h1 className="mb-4 text-4xl font-bold">404</h1>
        <p className="mb-4 text-xl text-muted-foreground">Oops! Page not found</p>
        <button
          type="button"
          className="mb-3 text-primary underline hover:text-primary/90"
          onClick={() => {
            if (window.history.length > 1) window.history.back();
            else window.location.assign("/home");
          }}
        >
          ‹ वापस
        </button>
        <a href="/home" className="block text-primary underline hover:text-primary/90">
          Return to Home
        </a>
        <a href="/#explore" className="mt-3 block text-primary underline hover:text-primary/90">
          Menu
        </a>
      </div>
    </div>
  );
};

export default NotFound;
