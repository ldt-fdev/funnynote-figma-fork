export default function FlashcardStudySkeleton() {
  return (
    <div className="flex flex-col items-center h-full w-full p-6 bg-gray-50 animate-pulse">
      {/* Top Buttons Section */}
      <div className="flex justify-center gap-4 w-full max-w-md mb-6">
        <div className="h-10 w-32 bg-gray-200 rounded-md"></div> {/* "Chỉnh sửa" button */}
        <div className="h-10 w-32 bg-gray-200 rounded-md"></div> {/* "Học tập" button */}
      </div>
      {/* Card Progress Text */}
      <div className="h-5 w-24 bg-gray-200 rounded mb-6"></div> {/* "Thẻ 1 / 15" text */}
      {/* Main Flashcard Placeholder */}
      <div className="w-full max-w-lg h-80 bg-white rounded-lg shadow-md flex flex-col items-center justify-center p-8 space-y-4">
        <div className="h-6 bg-gray-200 rounded w-3/4"></div> {/* Main question/term */}
        <div className="h-4 bg-gray-200 rounded w-1/2"></div> {/* Sub-text like "Nhấp để xem câu trả lời" */}
      </div>
      {/* Navigation Buttons Section */}
      <div className="flex justify-center gap-4 w-full max-w-md mt-8 mb-6">
        <div className="h-10 w-24 bg-gray-200 rounded-md"></div> {/* "Trước" button */}
        <div className="h-10 w-24 bg-gray-200 rounded-md"></div> {/* "Đặt lại" button */}
        <div className="h-10 w-24 bg-gray-200 rounded-md"></div> {/* "Sau" button */}
      </div>
      {/* Progress Bar */}
      <div className="w-full max-w-md h-2 bg-gray-200 rounded-full overflow-hidden mb-2">
        <div className="h-full w-1/4 bg-blue-500 rounded-full"></div> {/* Simulated progress */}
      </div>
      {/* Progress Text */}
      <div className="h-4 w-32 bg-gray-200 rounded"></div> {/* "Tiến độ học tập: 7%" text */}
    </div>
  );
}
