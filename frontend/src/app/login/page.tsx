import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import logo from "@/../public/twoniverse-high-resolution-logo-transparent.png";

const Login = () => {
  return (
    <div className="flex flex-col md:flex-row h-screen">
      {/* Login Container */}
      <div className="flex-1 bg-white flex items-center justify-center p-6">
        <div className="max-w-sm w-full">
          <Image
            src={logo}
            alt="Logo"
            width={200}
            height={100}
            className="mx-auto mb-8"
          />
          <h1 className="text-3xl font-bold mb-6 text-center">Login</h1>
          <form>
            <input
              type="email"
              placeholder="Email"
              className="w-full border border-gray-300 rounded-lg p-3 mb-4"
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full border border-gray-300 rounded-lg p-3 mb-4"
            />
            <Button className="w-full bg-greendark1 text-white py-3 rounded-lg font-bold hover:bg-greendark0">
              Login
            </Button>
            <p className="text-xs text-gray-500 text-center mt-2">
              Forgot your password?
            </p>
          </form>
        </div>
      </div>

      {/* Redirect Container */}
      <div className="flex-1 bg-greendark3 flex items-center justify-center text-white p-6 rounded-tl-3xl md:rounded-tr-none md:rounded-bl-3xl rounded-tr-3xl rounded-bl-none">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4 animate-pulse">
            Hello Friend!
          </h2>
          <p className="mb-6">Don't have an account?</p>
          <Link
            href="/signup"
            className="bg-white text-greendark3 py-2 px-6 rounded-lg font-bold hover:bg-gray-200"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;