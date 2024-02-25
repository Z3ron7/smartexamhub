import React, { useState } from 'react';
import Navbar from './NavbarSuper';
import Sidebar from './SidebarSuper';

const LayoutSuper = ({ children }) => {
  const [mobileMenu, setMobileMenu] = useState(false);

  // Function to close the mobile menu
  const closeMobileMenu = () => {
    setMobileMenu(false);
  };

  return (
    <>
      <div className='flex flex-auto h-full'>
        <Sidebar />
        <div className='grow'>
          <Navbar closeMobileMenu={closeMobileMenu} />
          <div className='m-5' onClick={closeMobileMenu}>{children}</div>
        </div>
      </div>
    </>
  );
};

export default LayoutSuper;
