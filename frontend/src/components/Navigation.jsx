import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import ThemeSwitcher from './ThemeSwitcher';
import FontSizeSelector from './FontSizeSelector';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import logo from '../assets/neuroaegis-logo.png';

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'AI Screening', href: '/screening' },
  { name: 'Cognitive Training', href: '/cognitive-training' },
  { name: 'Resource Hub', href: '/resources' },
];

export default function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { currentUser, logout, isAuthenticated } = useAuth();

  return (
    <header className="bg-white shadow-sm dark:bg-gray-800 dark:border-gray-700 transition-colors duration-200">
      <nav className="mx-auto flex max-w-7xl items-center justify-between p-4 lg:px-8" aria-label="Global">
        <div className="flex lg:flex-1">
          <Link to="/" className="-m-1.5 p-1.5 flex items-center">
            <img src={logo} alt="NeuroAegis Logo" className="h-10 w-auto" />
            <span className="ml-2 text-xl font-semibold text-gray-900 dark:text-white">NeuroAegis</span>
          </Link>
        </div>

        <div className="flex lg:hidden">
          <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700 dark:text-gray-200"
            onClick={() => setMobileMenuOpen(true)}
          >
            <span className="sr-only">Open main menu</span>
            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>

        <div className="hidden lg:flex lg:gap-x-12">
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className="text-sm font-semibold leading-6 text-gray-900 hover:text-primary-600 dark:text-gray-200 dark:hover:text-primary-400"
            >
              {item.name}
            </Link>
          ))}
        </div>

        <div className="hidden lg:flex lg:flex-1 lg:justify-end items-center gap-4">
          <FontSizeSelector />
          <ThemeSwitcher />

          {isAuthenticated ? (
            <div className="flex items-center">
              <Link
                to="/home"
                className="text-sm text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors cursor-pointer font-medium"
                title="Go to your home page"
              >
                {currentUser?.full_name || currentUser?.email || 'User'}
              </Link>
            </div>
          ) : (
            <div className="flex items-center gap-x-4">
              <Link
                to="/login"
                className="text-sm font-semibold leading-6 text-gray-900 dark:text-gray-200"
              >
                Log in
              </Link>
              <Link
                to="/register"
                className="rounded-md bg-primary-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 dark:bg-primary-700 dark:hover:bg-primary-600"
              >
                Sign up
              </Link>
            </div>
          )}
        </div>
      </nav>

      {/* Mobile menu, show/hide based on mobile menu state */}
      <div className={`lg:hidden ${mobileMenuOpen ? 'block' : 'hidden'}`}>
        <div className="fixed inset-0 z-50" />
        <div className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white dark:bg-gray-800 px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
          <div className="flex items-center justify-between">
            <Link to="/" className="-m-1.5 p-1.5 flex items-center">
              <img src={logo} alt="NeuroAegis Logo" className="h-10 w-auto" />
              <span className="ml-2 text-xl font-semibold text-gray-900 dark:text-white">NeuroAegis</span>
            </Link>
            <button
              type="button"
              className="-m-2.5 rounded-md p-2.5 text-gray-700 dark:text-gray-200"
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="sr-only">Close menu</span>
              <XMarkIcon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y divide-gray-500/10 dark:divide-gray-700">
              <div className="space-y-2 py-6">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-gray-700"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
                <div className="py-2 flex flex-col gap-2">
                  <FontSizeSelector className="mx-3" />
                  <ThemeSwitcher className="mx-3" />
                </div>
              </div>
              <div className="py-6">
                {isAuthenticated ? (
                  <Link
                    to="/home"
                    className="px-3 text-base font-semibold text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors block"
                    onClick={() => setMobileMenuOpen(false)}
                    title="Go to your home page"
                  >
                    {currentUser?.full_name || currentUser?.email || 'User'}
                  </Link>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Log in
                    </Link>
                    <Link
                      to="/register"
                      className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Sign up
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
} 