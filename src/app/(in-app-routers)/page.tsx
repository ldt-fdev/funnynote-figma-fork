export default function HomePage() {
  return (
    <div className="h-full w-full flex items-center justify-center bg-white">
      <div className="text-center">
        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-4xl text-gray-400">📝</span>
        </div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Chào mừng đến với FunnyNote</h2>
        <p className="text-gray-600 mb-4">Chọn một tệp từ thanh bên hoặc tạo một tệp mới để bắt đầu.</p>
      </div>
    </div>
  );
}
