"use client"

import { useState } from "react"
import { ArrowLeft, Mail, Lock, Eye, EyeOff, ChefHat } from "lucide-react"

export default function LoginPage({ 
  onLogin, 
  onBackToHome 
}: { 
  onLogin: () => void
  onBackToHome: () => void 
}) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    // Simulate login process
    setTimeout(() => {
      setIsLoading(false)
      onLogin()
    }, 1500)
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        {/* Back Button */}
        <button
          onClick={onBackToHome}
          className="flex items-center gap-2 text-gray-600 hover:text-black transition-colors mb-8"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="text-[15px] font-medium">Back to home</span>
        </button>

        {/* Logo and Title */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-12 h-12 bg-black rounded-2xl flex items-center justify-center">
              <ChefHat className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-black">FreshKeep</h1>
          </div>
          <h2 className="text-2xl font-semibold text-black mb-2">Welcome back</h2>
          <p className="text-gray-600 text-[15px]">Sign in to manage your kitchen</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-black mb-2">
              Email address
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-12 pr-4 py-4 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 text-black placeholder:text-gray-400 text-[15px] shadow-subtle transition-all duration-200"
                placeholder="Enter your email"
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-black mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-12 pr-12 py-4 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 text-black placeholder:text-gray-400 text-[15px] shadow-subtle transition-all duration-200"
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center">
              <input
                type="checkbox"
                className="w-4 h-4 text-black border-gray-300 rounded focus:ring-black"
              />
              <span className="ml-2 text-sm text-gray-600">Remember me</span>
            </label>
            <button
              type="button"
              className="text-sm text-black hover:text-gray-600 transition-colors"
            >
              Forgot password?
            </button>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-4 bg-black text-white rounded-xl font-medium text-[15px] hover:bg-gray-800 transition-all duration-200 shadow-subtle hover-lift-small disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Signing in...
              </div>
            ) : (
              "Sign in"
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="my-8 flex items-center">
          <div className="flex-1 border-t border-gray-200"></div>
          <span className="px-4 text-sm text-gray-500">or</span>
          <div className="flex-1 border-t border-gray-200"></div>
        </div>

        {/* Social Login */}
        <div className="space-y-3">
          <button className="w-full py-4 bg-white border border-gray-200 rounded-xl font-medium text-[15px] text-black hover:bg-gray-50 transition-all duration-200 shadow-subtle hover-lift-small">
            Continue with Google
          </button>
          <button className="w-full py-4 bg-white border border-gray-200 rounded-xl font-medium text-[15px] text-black hover:bg-gray-50 transition-all duration-200 shadow-subtle hover-lift-small">
            Continue with Apple
          </button>
        </div>

        {/* Sign Up Link */}
        <div className="text-center mt-8">
          <p className="text-sm text-gray-600">
            Don&apos;t have an account?{" "}
            <button className="text-black font-medium hover:text-gray-600 transition-colors">
              Sign up for free
            </button>
          </p>
        </div>

        {/* Demo Credentials */}
        <div className="mt-8 p-4 bg-gray-50 rounded-xl border border-gray-200">
          <h3 className="text-sm font-medium text-black mb-2">Demo Credentials</h3>
          <p className="text-xs text-gray-600 mb-1">Email: demo@freshkeep.com</p>
          <p className="text-xs text-gray-600">Password: demo123</p>
          <button
            onClick={() => {
              setEmail("demo@freshkeep.com")
              setPassword("demo123")
            }}
            className="mt-2 text-xs text-black hover:text-gray-600 transition-colors"
          >
            Fill demo credentials
          </button>
        </div>
      </div>
    </div>
  )
}
