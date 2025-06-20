import React, { useState } from 'react';
import {   Menu, Settings, ChevronDown } from 'lucide-react';
import Button from '../ui/Button';
import { useAppDispatch } from '../../Redux/hooks';
import { logout } from '../../Redux/features/auth/authSlice';
import { Link } from 'react-router-dom';

interface HeaderProps {
  onMenuClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  const dispatch = useAppDispatch();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm z-10">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Left side - Mobile menu button and search */}
          <div className="flex items-center flex-1">
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-500 lg:hidden hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
              onClick={onMenuClick}
            >
              <span className="sr-only">Open menu</span>
              <Menu className="block h-6 w-6" aria-hidden="true" />
            </button>
          </div>

          {/* Right side - User menu, notifications */}
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              size="sm"
              leftIcon={<Settings size={16} />}
              className="hidden lg:flex"
            >
              Settings
            </Button>

            {/* Profile dropdown */}
            <div className="relative">
              <button
                type="button"
                className="flex items-center space-x-2 focus:outline-none"
                onClick={() => setIsOpen(!isOpen)}
              >
                <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center cursor-pointer">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                  </svg>
                </div>
                <ChevronDown size={16} className="text-gray-400 hidden lg:block" />
              </button>

              {isOpen && (
                <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                  <div className="py-1 " role="menu" aria-orientation="vertical">
                    <Link 
                      to='/profile'
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" 
                      role="menuitem"
                      onClick={() => setIsOpen(false)}
                    >
                      Your Profile 
                    </Link>
                    <button
                      onClick={() => {
                        dispatch(logout());
                        setIsOpen(false);
                      }}
                      className="block cursor-pointer w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" 
                      role="menuitem"
                    >
                      Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

  
      </div>
    </header>
  );
};

export default Header;