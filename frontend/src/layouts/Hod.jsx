import React from 'react';
import { Outlet } from 'react-router-dom';
import HodMenu from '../components/static/HodMenu';

const HodLayout = () => {
  return (
    <div className="flex h-screen bg-gradient-to-br from-teal-50 to-cyan-50">
      <HodMenu />
      <div className="flex-1 overflow-auto">
        <Outlet />
      </div>
    </div>
  );
};

export default HodLayout;