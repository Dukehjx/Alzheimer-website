import React from 'react';
import RegisterForm from '../components/auth/RegisterForm';

export default function RegisterPage() {
    return (
        <div className="flex flex-col min-h-[calc(100vh-8rem)] items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="w-full max-w-md">
                <RegisterForm />
            </div>
        </div>
    );
} 