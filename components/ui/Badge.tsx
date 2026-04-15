export const StatusBadge = ({ status }: { status: string }) => {
  const styles: Record<string, string> = {
    active: "bg-green-100 text-green-600",
    succeeded: "bg-green-100 text-green-600",
    canceled: "bg-red-100 text-red-600",
    failed: "bg-red-100 text-red-600",
    pending: "bg-yellow-100 text-yellow-600",
    past_due: "bg-yellow-100 text-yellow-600",
    incomplete: "bg-gray-100 text-gray-600",
  };

  return (
    <span
      className={`px-2 py-1 text-xs font-medium rounded-md ${
        styles[status] || "bg-gray-100 text-gray-600"
      }`}
    >
      {status.replace("_", " ")}
    </span>
  );
};
