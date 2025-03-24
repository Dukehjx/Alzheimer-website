import React from 'react';
import LoginForm from '../components/auth/LoginForm';

export default function LoginPage() {
    return (
        <div className="flex flex-col min-h-[calc(100vh-8rem)] items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="w-full max-w-md">
                <LoginForm />
            </div>
        </div>
    );
} 