"use client"

import { useState } from "react"
import { FcGoogle } from "react-icons/fc"
import { FaEye, FaEyeSlash } from "react-icons/fa"
import { Link } from "react-router-dom"
import axios from "axios"
import { serverUrl } from "../utils/config"
import { signInWithPopup } from "firebase/auth"
import { auth, provider } from "../../utils/firebase"
import { useDispatch } from "react-redux"
import { setUserData } from "../redux/userSlice"

export default function SignIn() {
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const dispatch = useDispatch()

  const handleSignIn = async () => {
    try {
      const result = await axios.post(`${serverUrl}/api/auth/signin`, { email, password }, { withCredentials: true })
      dispatch(setUserData(result.data))
    } catch (error) {
      console.log(error)
    }
  }

  const handleGoogleAuth = async () => {
    try {
      const result = await signInWithPopup(auth, provider)
      console.log(result)
      if (result) {
        const { data } = await axios.post(
          `${serverUrl}/api/auth/googleauth`,
          {
            email: result.user.email,
          },
          { withCredentials: true },
        )
        dispatch(setUserData(data))
      }
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-gradient-to-br from-orange-50 via-red-50 to-pink-50">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-orange-200/30 to-red-200/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-pink-200/30 to-orange-200/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-red-100/20 to-orange-100/20 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="relative bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl w-full max-w-md p-8 border border-white/20 hover:shadow-3xl transition-all duration-500 hover:scale-[1.02]">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 bg-clip-text text-transparent">
            Zingo
          </h1>
          <p className="text-gray-600 text-sm leading-relaxed">
            Welcome back! Please sign in to continue enjoying delicious food deliveries.
          </p>
        </div>

        <div className="space-y-6">
          <div className="group">
            <label className="block text-gray-700 font-medium mb-2 text-sm">Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-300 bg-white/50 backdrop-blur-sm hover:bg-white/70"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="group">
            <label className="block text-gray-700 font-medium mb-2 text-sm">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-300 bg-white/50 backdrop-blur-sm hover:bg-white/70"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-orange-500 transition-colors duration-200"
              >
                {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
              </button>
            </div>
          </div>

          <div className="text-right">
            <Link
              to="/forgot-password"
              className="text-sm font-medium text-orange-500 hover:text-red-500 transition-colors duration-200 hover:underline"
            >
              Forgot Password?
            </Link>
          </div>

          <button
            className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold py-3 rounded-xl transition-all duration-300 hover:from-orange-600 hover:to-red-600 hover:shadow-lg hover:shadow-orange-500/25 transform hover:scale-[1.02] active:scale-[0.98]"
            onClick={handleSignIn}
          >
            Sign In
          </button>

          <button
            className="w-full flex items-center justify-center gap-3 border border-gray-200 rounded-xl px-4 py-3 transition-all duration-300 hover:bg-gray-50 hover:border-gray-300 hover:shadow-md bg-white/50 backdrop-blur-sm"
            onClick={handleGoogleAuth}
          >
            <FcGoogle size={20} />
            <span className="font-medium text-gray-700">Sign in with Google</span>
          </button>

          <p className="text-center text-gray-600 text-sm">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="font-semibold text-orange-500 hover:text-red-500 transition-colors duration-200 hover:underline"
            >
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
