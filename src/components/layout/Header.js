import React from 'react';
import { 
  Bars3Icon,
  MagnifyingGlassIcon,
  BellIcon,
} from '@heroicons/react/24/outline';

export default function Header({ setSidebarOpen, darkMode, condensed }) {
  return (
    <header className={`sticky top-0 z-30 bg-white dark:bg-neutral-800 shadow-sm transition-all duration-300 ease-in-out ${condensed ? 'lg:pl-20' : 'lg:pl-64'}`}>
      <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left section with mobile menu button */}
        <div className="flex items-center">
          <button
            type="button"
            className="lg:hidden -mx-2 inline-flex h-10 w-10 items-center justify-center rounded-md text-neutral-500 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-700 focus:outline-none"
            onClick={() => setSidebarOpen(true)}
          >
            <span className="sr-only">Open sidebar</span>
            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
          </button>
          
          {/* Search bar */}
          <div className="mx-2 sm:mx-4 lg:mx-0 w-full max-w-xs lg:max-w-md">
            <label htmlFor="search" className="sr-only">Search</label>
            <div className="relative text-neutral-400 dark:text-neutral-500 focus-within:text-neutral-500 dark:focus-within:text-neutral-400">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <MagnifyingGlassIcon className="h-5 w-5" aria-hidden="true" />
              </div>
              <input
                id="search"
                className="block w-full rounded-md border-0 bg-white dark:bg-neutral-700 py-1.5 pl-10 pr-3 text-sm text-neutral-900 dark:text-white ring-1 ring-inset ring-neutral-300 dark:ring-neutral-600 placeholder:text-neutral-400 dark:placeholder:text-neutral-500 focus:ring-2 focus:ring-inset focus:ring-primary-500 sm:text-sm"
                placeholder="Search"
                type="search"
                name="search"
              />
            </div>
          </div>
        </div>
        
        {/* Right section with notifications */}
        <div className="flex items-center space-x-4">
          {/* Notification Bell */}
          <button
            type="button"
            className="relative p-1 text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors"
          >
            <span className="sr-only">View notifications</span>
            <BellIcon className="h-6 w-6" aria-hidden="true" />
            {/* Notification indicator */}
            <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-primary-500 ring-2 ring-white dark:ring-neutral-800" />
          </button>
        </div>
      </div>
    </header>
  );
} 