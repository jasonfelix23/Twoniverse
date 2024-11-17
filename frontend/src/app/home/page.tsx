import React from "react";
import { Button } from "@/components/ui/button";
import { LogIn, UserPlus } from "lucide-react";
import red from "@/../../public/32_24_office_no_zoom.png";
import logo from "@/../../public/twoniverse-high-resolution-logo-transparent.png";
import Image from "next/image";

const Navbar = () => {
  return (
    <nav className="container mx-auto px-4 py-6 flex items-center justify-between">
      <Image src={logo} alt="Twoniverse" width={150} />
      <div className="flex gap-4 z-10">
        <Button className="flex items-center gap-2 bg-white hover:bg-white hover:border hover:border-gray-600 hover:text-greendark3 text-black shadow-lg">
          <LogIn className="w-4 h-4" />
          Login
        </Button>
        <Button className="flex items-center gap-2 bg-greendark1 hover:bg-greendark0 hover:border hover:border-gray-300">
          <UserPlus className="w-4 h-4" />
          Sign Up
        </Button>
      </div>
    </nav>
  );
};

const Hero = () => {
  return (
    <div className="container mx-auto px-4 py-24 flex flex-col items-center text-center gap-8">
      <h1 className="text-6xl font-bold bg-gradient-to-r from-greendark0 to-greendark3 bg-clip-text text-transparent">
        Welcome to TwoNiverse
      </h1>
      <p className="text-xl text-foreground/80 max-w-2xl">
        Join our immersive multiplayer experience where you can explore,
        connect, and meet with friends in a unique virtual world.
      </p>
      <div className="flex gap-4 z-10">
        <Button
          size="lg"
          className="bg-greendark1 hover:bg-greendark0 hover:border hover:border-gray-300"
        >
          Start Playing
        </Button>
        <Button
          size="lg"
          variant="outline"
          className="hover:border hover:border-gray-600"
        >
          Learn More
        </Button>
      </div>

      <div className="mt-12 relative">
        <div className="absolute -inset-4 bg-greendark1/20 rounded-xl blur-xl" />
        <Image
          src={red}
          alt="Game Preview"
          className="relative rounded-lg border border-greendark1/20 shadow-2xl"
        />
      </div>
    </div>
  );
};

const Footer = () => {
  return (
    <footer className="container mx-auto px-4 py-8 mt-auto">
      <div className="border-t border-greendark1/20 pt-8 flex justify-between items-center">
        <div className="text-sm text-foreground/60">
          © 2024 TwoNiverse. All rights reserved.
        </div>
        <div className="flex gap-6 text-sm text-foreground/60">
          <a href="#" className="hover:text-greendark0">
            Privacy Policy
          </a>
          <a href="#" className="hover:text-greendark0">
            Terms of Service
          </a>
          <a href="#" className="hover:text-greendark0">
            Contact
          </a>
        </div>
      </div>
    </footer>
  );
};

const LandingPage = () => {
  return (
    <div className="relative h-full w-full bg-white">
      <div className="absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_18px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]"></div>
      <Navbar />
      <Hero />
      <Footer />
    </div>
  );
};

export default LandingPage;
