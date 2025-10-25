import React from "react";
import { Outlet } from "react-router-dom";
import PrincipalMenu from "../components/static/PrincipalMenu";

const PrincipalLayout = () => {
  return (
    <div className="h-screen bg-gradient-to-br from-purple-50 via-violet-50 to-indigo-50 flex">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -inset-10 opacity-30">
          <div className="w-80 h-80 bg-purple-400 rounded-full blur-3xl absolute top-1/4 left-1/4 animate-pulse"></div>
          <div className="w-80 h-80 bg-violet-400 rounded-full blur-3xl absolute bottom-1/4 right-1/4 animate-pulse delay-1000"></div>
        </div>
      </div>
      
      {/* Left Sidebar Menu */}
      <div className="relative z-10">
        <PrincipalMenu />
      </div>
      
      {/* Main Content */}
      <main className="flex-1 overflow-auto relative z-10">
        <Outlet />
      </main>
    </div>
  );
};

export default PrincipalLayout;