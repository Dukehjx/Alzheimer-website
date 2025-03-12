import React, { Fragment } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Dialog, Transition } from '@headlessui/react';
import { 
  XMarkIcon,
  HomeIcon,
  BeakerIcon,
  BookOpenIcon,
  ChartBarIcon,
  SunIcon,
  MoonIcon,
  BellIcon,
  ChevronRightIcon,
  ChevronLeftIcon,
} from '@heroicons/react/24/outline';

// If BrainIcon doesn't exist in the Heroicons package, here's a custom implementation
const BrainCustomIcon = (props) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    fill="none" 
    viewBox="0 0 24 24" 
    strokeWidth={1.5} 
    stroke="currentColor" 
    {...props}
  >
    <path 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      d="M12 18c.33 0 .6-.27.6-.6V7.8c0-.17.17-.3.34-.24l5.34 1.8c.23.08.47-.07.47-.3V7.5c0-.13-.08-.24-.2-.28l-5.8-1.94c-.1-.03-.21-.03-.3 0l-5.8 1.94c-.12.04-.2.15-.2.28v1.56c0 .23.24.38.47.3l5.34-1.8c.17-.06.34.07.34.24v9.6c0 .33.27.6.6.6z" 
    />
    <path 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      d="M8 10v4a4 4 0 0 0 8 0v-4" 
    />
  </svg>
);

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function Sidebar({ open, setOpen, darkMode, toggleDarkMode, condensed, toggleCondensed }) {
  const location = useLocation();
  
  const navigation = [
    { name: 'Dashboard', href: '/', icon: HomeIcon },
    { name: 'AI Screening', href: '/ai-screening', icon: BrainCustomIcon },
    { name: 'Cognitive Training', href: '/cognitive-training', icon: BeakerIcon },
    { name: 'Resource Hub', href: '/resource-hub', icon: BookOpenIcon },
    { name: 'Health Monitoring', href: '/health-monitoring', icon: ChartBarIcon },
  ];

  return (
    <>
      {/* Mobile Sidebar (off-canvas menu) */}
      <Transition.Root show={open} as={Fragment}>
        <Dialog as="div" className="relative z-50 lg:hidden" onClose={setOpen}>
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-neutral-900/80 backdrop-blur-sm" />
          </Transition.Child>

          <div className="fixed inset-0 z-50 flex">
            <Transition.Child
              as={Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full"
            >
              <Dialog.Panel className="relative flex w-full max-w-xs flex-1 flex-col bg-white dark:bg-neutral-800 pt-5 pb-4">
                <Transition.Child
                  as={Fragment}
                  enter="ease-in-out duration-300"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="ease-in-out duration-300"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <div className="absolute top-0 right-0 -mr-12 pt-2">
                    <button
                      type="button"
                      className="ml-1 flex h-10 w-10 items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                      onClick={() => setOpen(false)}
                    >
                      <span className="sr-only">Close sidebar</span>
                      <XMarkIcon className="h-6 w-6 text-white" aria-hidden="true" />
                    </button>
                  </div>
                </Transition.Child>
                
                {/* Logo */}
                <div className="flex flex-shrink-0 items-center px-4">
                  <Link to="/" className="flex items-center" onClick={() => setOpen(false)}>
                    <div className="flex items-center justify-center h-10 w-10 rounded-full bg-primary-500 text-white">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 3a7 7 0 100 14 7 7 0 000-14zm-9 7a9 9 0 1118 0 9 9 0 01-18 0z" clipRule="evenodd" />
                        <path fillRule="evenodd" d="M10 12a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="ml-3 text-xl font-bold text-neutral-900 dark:text-white">NeuroCare AI</span>
                  </Link>
                </div>
                
                {/* Mobile Navigation */}
                <div className="mt-5 h-0 flex-1 overflow-y-auto px-2">
                  <nav className="space-y-1">
                    {navigation.map((item) => {
                      const isActive = location.pathname === item.href || 
                                       (item.href !== '/' && location.pathname.startsWith(item.href));
                      return (
                        <Link
                          key={item.name}
                          to={item.href}
                          onClick={() => setOpen(false)}
                          className={classNames(
                            isActive
                              ? 'bg-primary-100 text-primary-900 dark:bg-primary-900/20 dark:text-primary-100'
                              : 'text-neutral-600 hover:bg-neutral-50 dark:text-neutral-300 dark:hover:bg-neutral-700/50',
                            'group flex items-center px-3 py-2 text-base font-medium rounded-md'
                          )}
                          aria-current={isActive ? 'page' : undefined}
                        >
                          <item.icon
                            className={classNames(
                              isActive 
                                ? 'text-primary-500 dark:text-primary-400'
                                : 'text-neutral-500 dark:text-neutral-400 group-hover:text-neutral-900 dark:group-hover:text-white',
                              'mr-4 h-6 w-6 flex-shrink-0'
                            )}
                            aria-hidden="true"
                          />
                          {item.name}
                        </Link>
                      );
                    })}
                    
                    {/* Divider */}
                    <div className="border-t border-neutral-200 dark:border-neutral-700 my-4"></div>
                    
                    {/* Additional controls - mobile */}
                    <div className="space-y-1">
                      {/* Dark Mode Toggle - Mobile */}
                      <button
                        onClick={toggleDarkMode}
                        className="w-full text-left text-neutral-600 hover:bg-neutral-50 dark:text-neutral-300 dark:hover:bg-neutral-700/50 group flex items-center px-3 py-2 text-base font-medium rounded-md"
                      >
                        {darkMode ? (
                          <>
                            <SunIcon className="mr-4 h-6 w-6 text-neutral-500 dark:text-neutral-400 group-hover:text-neutral-900 dark:group-hover:text-white" />
                            Light Mode
                          </>
                        ) : (
                          <>
                            <MoonIcon className="mr-4 h-6 w-6 text-neutral-500 dark:text-neutral-400 group-hover:text-neutral-900 dark:group-hover:text-white" />
                            Dark Mode
                          </>
                        )}
                      </button>
                      
                      {/* Notifications - Mobile */}
                      <Link
                        to="/notifications"
                        onClick={() => setOpen(false)}
                        className="text-neutral-600 hover:bg-neutral-50 dark:text-neutral-300 dark:hover:bg-neutral-700/50 group flex items-center px-3 py-2 text-base font-medium rounded-md"
                      >
                        <BellIcon className="mr-4 h-6 w-6 text-neutral-500 dark:text-neutral-400 group-hover:text-neutral-900 dark:group-hover:text-white" />
                        Notifications
                      </Link>
                    </div>
                  </nav>
                </div>
              </Dialog.Panel>
            </Transition.Child>
            <div className="w-14 flex-shrink-0" aria-hidden="true">
              {/* Dummy element to force sidebar to shrink to fit close icon */}
            </div>
          </div>
        </Dialog>
      </Transition.Root>

      {/* Desktop Sidebar (static) */}
      <div className={classNames(
        "hidden lg:fixed lg:inset-y-0 lg:z-40 lg:flex lg:flex-col transition-all duration-300 ease-in-out",
        condensed ? "lg:w-20" : "lg:w-64"
      )}>
        <div className="flex min-h-0 flex-1 flex-col border-r border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800">
          {/* Logo */}
          <div 
            className="flex h-16 flex-shrink-0 items-center px-4 border-b border-neutral-200 dark:border-neutral-700 cursor-pointer group"
            onClick={toggleCondensed}
          >
            <div className="flex items-center">
              <div className="flex items-center justify-center h-10 w-10 rounded-full bg-primary-500 text-white">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 3a7 7 0 100 14 7 7 0 000-14zm-9 7a9 9 0 1118 0 9 9 0 01-18 0z" clipRule="evenodd" />
                  <path fillRule="evenodd" d="M10 12a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
              </div>
              
              {/* Logo name only shown in expanded mode */}
              {!condensed && (
                <span className="ml-3 text-xl font-bold text-neutral-900 dark:text-white">NeuroCare AI</span>
              )}
              
              {/* Toggle icon */}
              <div className={classNames(
                condensed ? "ml-1" : "ml-auto",
                "text-neutral-500 dark:text-neutral-400 group-hover:text-neutral-900 dark:group-hover:text-white"
              )}>
                {condensed ? (
                  <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
                ) : (
                  <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
                )}
              </div>
            </div>
          </div>
          
          {/* Desktop Navigation */}
          <div className="flex flex-1 flex-col overflow-y-auto pt-5 pb-4">
            <nav className="flex-1 space-y-1 px-2">
              {navigation.map((item) => {
                const isActive = location.pathname === item.href || 
                                 (item.href !== '/' && location.pathname.startsWith(item.href));
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={classNames(
                      isActive
                        ? 'bg-primary-50 text-primary-900 dark:bg-primary-900/20 dark:text-primary-100'
                        : 'text-neutral-600 hover:bg-neutral-50 dark:text-neutral-300 dark:hover:bg-neutral-700/50',
                      condensed ? 'justify-center px-2' : 'px-3',
                      'group flex items-center py-2 text-sm font-medium rounded-md transition-colors'
                    )}
                    title={condensed ? item.name : ""}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    <item.icon
                      className={classNames(
                        isActive 
                          ? 'text-primary-500 dark:text-primary-400'
                          : 'text-neutral-500 dark:text-neutral-400 group-hover:text-neutral-900 dark:group-hover:text-white',
                        condensed ? 'mr-0 h-6 w-6' : 'mr-3 h-5 w-5',
                        'flex-shrink-0 transition-colors'
                      )}
                      aria-hidden="true"
                    />
                    {/* Only show text in expanded mode */}
                    {!condensed && <span>{item.name}</span>}
                  </Link>
                );
              })}
              
              {/* Divider */}
              <div className="border-t border-neutral-200 dark:border-neutral-700 my-4"></div>
              
              {/* Additional controls - desktop */}
              <div className="space-y-1">
                {/* Dark Mode Toggle - Desktop */}
                <button
                  onClick={toggleDarkMode}
                  className={classNames(
                    'text-neutral-600 hover:bg-neutral-50 dark:text-neutral-300 dark:hover:bg-neutral-700/50 group flex items-center py-2 text-sm font-medium rounded-md transition-colors',
                    condensed ? 'justify-center px-2 mx-auto w-10' : 'px-3 w-full text-left'
                  )}
                  title={condensed ? (darkMode ? "Light Mode" : "Dark Mode") : ""}
                >
                  {darkMode ? (
                    <>
                      <SunIcon className={classNames(
                        'text-neutral-500 dark:text-neutral-400 group-hover:text-neutral-900 dark:group-hover:text-white',
                        condensed ? 'h-6 w-6' : 'mr-3 h-5 w-5'
                      )} />
                      {!condensed && "Light Mode"}
                    </>
                  ) : (
                    <>
                      <MoonIcon className={classNames(
                        'text-neutral-500 dark:text-neutral-400 group-hover:text-neutral-900 dark:group-hover:text-white',
                        condensed ? 'h-6 w-6' : 'mr-3 h-5 w-5'
                      )} />
                      {!condensed && "Dark Mode"}
                    </>
                  )}
                </button>
                
                {/* Notifications - Desktop */}
                <Link
                  to="/notifications"
                  className={classNames(
                    'text-neutral-600 hover:bg-neutral-50 dark:text-neutral-300 dark:hover:bg-neutral-700/50 group flex items-center py-2 text-sm font-medium rounded-md transition-colors',
                    condensed ? 'justify-center px-2 mx-auto w-10' : 'px-3'
                  )}
                  title={condensed ? "Notifications" : ""}
                >
                  <BellIcon className={classNames(
                    'text-neutral-500 dark:text-neutral-400 group-hover:text-neutral-900 dark:group-hover:text-white',
                    condensed ? 'h-6 w-6' : 'mr-3 h-5 w-5'
                  )} />
                  {!condensed && "Notifications"}
                </Link>
              </div>
            </nav>
            
            {/* User information at bottom of sidebar - only on expanded mode */}
            {!condensed && (
              <div className="border-t border-neutral-200 dark:border-neutral-700 p-4">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <UserIcon className="h-8 w-8 rounded-full bg-neutral-200 dark:bg-neutral-700 p-1 text-neutral-600 dark:text-neutral-300" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-neutral-700 dark:text-neutral-200">User Account</p>
                    <Link 
                      to="/profile" 
                      className="text-xs text-neutral-500 dark:text-neutral-400 hover:text-primary-500 dark:hover:text-primary-400"
                    >
                      View profile
                    </Link>
                  </div>
                </div>
              </div>
            )}
            
            {/* Condensed User Profile */}
            {condensed && (
              <div className="border-t border-neutral-200 dark:border-neutral-700 p-4 flex justify-center">
                <Link 
                  to="/profile"
                  title="User Profile"
                  className="flex-shrink-0"
                >
                  <UserIcon className="h-8 w-8 rounded-full bg-neutral-200 dark:bg-neutral-700 p-1 text-neutral-600 dark:text-neutral-300 hover:text-primary-500 dark:hover:text-primary-400" />
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

// Simple user icon for the sidebar
function UserIcon(props) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  );
} 