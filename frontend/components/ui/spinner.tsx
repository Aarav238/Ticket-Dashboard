/**
 * Loading Spinner Component - Simple animated loading spinner
 * Used throughout the app for loading states
 */

export const Spinner = ({ className }: { className?: string }) => {
  return (
    <div
      className={`inline-block animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite] ${
        className || "h-8 w-8"
      }`}
      role="status"
    >
      <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
        Loading...
      </span>
    </div>
  );
};

