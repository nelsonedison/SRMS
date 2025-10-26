import React from "react";
import { Outlet } from "react-router-dom";
import StudentMenu from "../components/static/StudentMenu";

const StudentLayout = () => {
  return (
    <div className="h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-cyan-50 flex">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -inset-10 opacity-30">
          <div className="w-80 h-80 bg-green-400 rounded-full blur-3xl absolute top-1/4 left-1/4 animate-pulse"></div>
          <div className="w-80 h-80 bg-emerald-400 rounded-full blur-3xl absolute bottom-1/4 right-1/4 animate-pulse delay-1000"></div>
        </div>
      </div>
      
      {/* Left Sidebar Menu */}
      <div className="relative z-10">
        <StudentMenu />
      </div>
      
      {/* Main Content */}
      <main className="flex-1 overflow-auto relative z-10">
        <Outlet />
      </main>
    </div>
  );
};

export default StudentLayout;