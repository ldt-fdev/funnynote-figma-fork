export default function LoginPageSkeleton() {
  return (
    <div className="flex h-[92vh] w-full bg-gray-100 animate-pulse">
      {/* Main Content Area Skeleton (Background) */}
      <div className="flex-1 flex items-center justify-center bg-gray-800 relative overflow-hidden">
        {/* Abstract background elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-purple-900 to-gray-900 opacity-50"></div>
        <div className="absolute top-1/4 left-1/4 h-48 w-48 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
        <div className="absolute top-1/2 right-1/4 h-48 w-48 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-1/4 left-1/3 h-48 w-48 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>

        {/* Login Form Skeleton */}
        <div className="relative z-10 p-8 bg-white/10 backdrop-blur-lg rounded-xl shadow-2xl w-full max-w-md space-y-6 border border-white/20">
          {/* Username/Email Field */}
          <div className="space-y-2">
            <div className="h-4 w-2/5 bg-gray-200 rounded"></div> {/* Label */}
            <div className="h-10 bg-gray-200 rounded-md"></div> {/* Input field */}
          </div>
          {/* Password Field */}
          <div className="space-y-2">
            <div className="h-4 w-2/5 bg-gray-200 rounded"></div> {/* Label */}
            <div className="h-10 bg-gray-200 rounded-md"></div> {/* Input field */}
          </div>
          {/* Login Button */}
          <div className="h-11 bg-gray-200 rounded-md"></div>
          {/* Separator */}
          <div className="flex items-center">
            <div className="flex-grow border-t border-gray-300"></div>
            <div className="mx-4 h-4 w-20 bg-gray-200 rounded"></div> {/* "Hoặc tiếp tục với" text */}
            <div className="flex-grow border-t border-gray-300"></div>
          </div>
          {/* Google Login Button */}
          <div className="h-11 bg-gray-200 rounded-md"></div>
          {/* Links */}
          <div className="flex justify-between text-sm">
            <div className="h-4 w-28 bg-gray-200 rounded"></div> {/* "Tạo tài khoản mới" */}
            <div className="h-4 w-28 bg-gray-200 rounded"></div> {/* "Quên mật khẩu" */}
          </div>
          <div className="text-center">
            <div className="h-4 w-40 bg-gray-200 rounded mx-auto"></div> {/* "Get back to home page" */}
          </div>
        </div>
      </div>
    </div>
  );
}
