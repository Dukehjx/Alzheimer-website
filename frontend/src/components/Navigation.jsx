import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import ThemeSwitcher from './ThemeSwitcher';
import FontSizeSelector from './FontSizeSelector';
import LanguageSwitcher from './LanguageSwitcher';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import logo from '../assets/neuroaegis-logo.png';

export default function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { currentUser, logout, isAuthenticated } = useAuth();
  const { t } = useTranslation();

  const navigation = [
    { name: t('nav.home'), href: '/' },
    { name: t('nav.aiScreening'), href: '/screening' },
    { name: t('nav.cognitiveTraining'), href: '/cognitive-training' },
    { name: t('nav.resourceHub'), href: '/resources' },
  ];

  return (
    <header className="bg-white shadow-sm dark:bg-gray-800 dark:border-gray-700 transition-colors duration-200">
      <nav className="mx-auto flex max-w-8xl items-center justify-between px-4 py-3 lg:px-6 xl:px-8" aria-label="Global">
        {/* Logo Section - Fixed width */}
        <div className="flex items-center min-w-0 flex-shrink-0">
          <Link to="/" className="flex items-center space-x-2">
            <img src={logo} alt="NeuroAegis Logo" className="h-9 w-auto" />
            <span className="text-lg font-semibold text-gray-900 dark:text-white hidden sm:block">NeuroAegis</span>
          </Link>
        </div>

        {/* Mobile menu button */}
        <div className="flex lg:hidden">
          <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            onClick={() => setMobileMenuOpen(true)}
          >
            <span className="sr-only">{t('nav.openMenu')}</span>
            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>

        {/* Main Navigation - Centered with flex grow */}
        <div className="hidden lg:flex lg:items-center lg:justify-center flex-1 px-8">
          <div className="flex space-x-6 xl:space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="text-sm font-medium text-gray-900 hover:text-primary-600 dark:text-gray-200 dark:hover:text-primary-400 transition-colors duration-200 px-2 py-1 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700/50 whitespace-nowrap"
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>

        {/* Right Side Controls - Organized in sections */}
        <div className="hidden lg:flex lg:items-center lg:space-x-3 xl:space-x-4 flex-shrink-0">
          {/* User Controls Group */}
          <div className="flex items-center space-x-2 xl:space-x-3">
            <LanguageSwitcher />
            <FontSizeSelector />
            <ThemeSwitcher />
          </div>

          {/* Separator */}
          <div className="h-6 w-px bg-gray-300 dark:bg-gray-600"></div>

          {/* Auth Section */}
          {isAuthenticated ? (
            <div className="flex items-center">
              <Link
                to="/home"
                className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200 px-3 py-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700/50"
                title="Go to your home page"
              >
                {currentUser?.full_name || currentUser?.email || 'User'}
              </Link>
            </div>
          ) : (
            <div className="flex items-center space-x-3">
              <Link
                to="/login"
                className="text-sm font-medium text-gray-900 dark:text-gray-200 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200 px-3 py-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700/50"
              >
                {t('nav.login')}
              </Link>
              <Link
                to="/register"
                className="inline-flex items-center justify-center rounded-md bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 dark:bg-primary-700 dark:hover:bg-primary-600 transition-colors duration-200"
              >
                {t('nav.register')}
              </Link>
            </div>
          )}
        </div>
      </nav>

      {/* Mobile menu, show/hide based on mobile menu state */}
      <div className={`lg:hidden ${mobileMenuOpen ? 'block' : 'hidden'}`}>
        <div className="fixed inset-0 z-50" />
        <div className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white dark:bg-gray-800 px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10 shadow-xl">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-2">
              <img src={logo} alt="NeuroAegis Logo" className="h-9 w-auto" />
              <span className="text-lg font-semibold text-gray-900 dark:text-white">NeuroAegis</span>
            </Link>
            <button
              type="button"
              className="-m-2.5 rounded-md p-2.5 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="sr-only">{t('nav.closeMenu')}</span>
              <XMarkIcon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>

          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y divide-gray-500/10 dark:divide-gray-700">
              {/* Navigation Links */}
              <div className="space-y-2 py-6">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className="-mx-3 block rounded-lg px-3 py-3 text-base font-medium leading-7 text-gray-900 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-gray-700 transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>

              {/* Controls Section */}
              <div className="py-6">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-4">Settings</h3>
                <div className="space-y-3">
                  <LanguageSwitcher className="w-full" />
                  <FontSizeSelector className="w-full" />
                  <ThemeSwitcher className="w-full" />
                </div>
              </div>

              {/* Auth Section */}
              <div className="py-6">
                {isAuthenticated ? (
                  <Link
                    to="/home"
                    className="block px-3 py-3 text-base font-medium text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                    onClick={() => setMobileMenuOpen(false)}
                    title="Go to your home page"
                  >
                    {currentUser?.full_name || currentUser?.email || 'User'}
                  </Link>
                ) : (
                  <div className="space-y-3">
                    <Link
                      to="/login"
                      className="block w-full text-center rounded-lg px-3 py-3 text-base font-medium text-gray-900 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors border border-gray-300 dark:border-gray-600"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {t('nav.login')}
                    </Link>
                    <Link
                      to="/register"
                      className="block w-full text-center rounded-lg px-3 py-3 text-base font-medium text-white bg-primary-600 hover:bg-primary-500 dark:bg-primary-700 dark:hover:bg-primary-600 transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {t('nav.register')}
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
} 