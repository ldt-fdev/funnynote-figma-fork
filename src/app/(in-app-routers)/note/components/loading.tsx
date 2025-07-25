export default function NoteEditorPlaceholder() {
  return (
    <div className="flex flex-col h-full w-full bg-white animate-pulse">
      {/* Toolbar Placeholder */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        {/* Left side icons */}
        <div className="flex items-center gap-2">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="h-8 w-8 bg-gray-200 rounded-md"></div>
          ))}
        </div>
        {/* Right side buttons */}
        <div className="flex items-center gap-2">
          <div className="h-9 w-36 bg-gray-200 rounded-md"></div> {/* "Tạo thẻ ghi nhớ AI" button */}
          <div className="h-9 w-20 bg-gray-200 rounded-md"></div> {/* "Lưu lại" button */}
        </div>
      </div>

      {/* Content Area Placeholder */}
      <div className="flex-1 p-6 space-y-3">
        <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div> {/* Placeholder for "Bắt đầu viết ở đây..." */}
        <div className="h-4 bg-gray-200 rounded w-full"></div>
        <div className="h-4 bg-gray-200 rounded w-11/12"></div>
        <div className="h-4 bg-gray-200 rounded w-full"></div>
        <div className="h-4 bg-gray-200 rounded w-10/12"></div>
        <div className="h-4 bg-gray-200 rounded w-full"></div>
        <div className="h-4 bg-gray-200 rounded w-9/12"></div>
        <div className="h-4 bg-gray-200 rounded w-full"></div>
        <div className="h-4 bg-gray-200 rounded w-full"></div>
        <div className="h-4 bg-gray-200 rounded w-8/12"></div>
        <div className="h-4 bg-gray-200 rounded w-full"></div>
        <div className="h-4 bg-gray-200 rounded w-11/12"></div>
        <div className="h-4 bg-gray-200 rounded w-full"></div>
        <div className="h-4 bg-gray-200 rounded w-10/12"></div>
        <div className="h-4 bg-gray-200 rounded w-full"></div>
        <div className="h-4 bg-gray-200 rounded w-9/12"></div>
        <div className="h-4 bg-gray-200 rounded w-full"></div>
        <div className="h-4 bg-gray-200 rounded w-full"></div>
        <div className="h-4 bg-gray-200 rounded w-8/12"></div>
      </div>
    </div>
  );
}
