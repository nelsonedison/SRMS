import React from 'react';
import { Outlet } from 'react-router-dom';
import TutorMenu from '../components/static/TutorMenu';

const TutorLayout = () => {
  return (
    <div className="flex h-screen bg-gradient-to-br from-green-50 to-emerald-50">
      <TutorMenu />
      <div className="flex-1 overflow-auto">
        <Outlet />
      </div>
    </div>
  );
};

export default TutorLayout;