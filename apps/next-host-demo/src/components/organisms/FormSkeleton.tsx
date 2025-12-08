export function FormSkeleton() {
  return (
    <div className="w-full max-w-4xl mx-auto animate-pulse">
      <div className="bg-white rounded-lg shadow p-6 space-y-4">
        <div className="h-8 bg-gray-200 rounded w-1/3"></div>
        <div className="h-4 bg-gray-200 rounded w-2/3"></div>
        <div className="space-y-3 pt-4">
          <div className="h-10 bg-gray-200 rounded"></div>
          <div className="h-10 bg-gray-200 rounded"></div>
          <div className="h-10 bg-gray-200 rounded"></div>
        </div>
      </div>
    </div>
  );
}
