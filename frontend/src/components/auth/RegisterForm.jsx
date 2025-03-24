import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export default function RegisterForm() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { register } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Clear error when user types
        if (error) setError('');
    };

    const validatePassword = (password) => {
        const errors = [];

        if (password.length < 8) {
            errors.push("Password must be at least 8 characters");
        }

        if (!/[A-Z]/.test(password)) {
            errors.push("Password must contain at least one uppercase letter");
        }

        if (!/\d/.test(password)) {
            errors.push("Password must contain at least one digit");
        }

        return errors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Validate password match
        if (formData.password !== formData.confirmPassword) {
            return setError('Passwords do not match');
        }

        // Validate password requirements
        const passwordErrors = validatePassword(formData.password);
        if (passwordErrors.length > 0) {
            return setError(passwordErrors.join(". "));
        }

        setIsSubmitting(true);

        try {
            // Remove confirmPassword from data sent to API
            const { confirmPassword, ...userData } = formData;
            await register(userData);
            navigate('/');
        } catch (err) {
            console.error('Registration error:', err);

            // Extract error details from the response
            if (err.response?.data?.details) {
                const validationErrors = err.response.data.details;
                const errorMessages = validationErrors.map(error => error.msg);
                setError(errorMessages.join('. '));
            } else {
                setError(err.response?.data?.message || 'Registration failed. Please try again.');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="w-full max-w-md mx-auto p-6">
            <div className="mt-7 bg-white border border-gray-200 rounded-xl shadow-sm dark:bg-gray-800 dark:border-gray-700">
                <div className="p-4 sm:p-7">
                    <div className="text-center">
                        <h1 className="block text-2xl font-bold text-gray-800 dark:text-white">Sign up</h1>
                        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                            Already have an account?{' '}
                            <Link to="/login" className="text-primary-600 decoration-2 hover:underline font-medium dark:text-primary-400">
                                Sign in here
                            </Link>
                        </p>
                    </div>

                    <div className="mt-5">
                        {error && (
                            <div className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-700 dark:text-red-400" role="alert">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit}>
                            <div className="grid gap-y-4">
                                <div>
                                    <label htmlFor="name" className="block text-sm mb-2 dark:text-white">Full name</label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            id="name"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-primary-500 focus:ring-primary-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-gray-700 dark:border-gray-600 dark:text-gray-400 dark:focus:ring-primary-400"
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="email" className="block text-sm mb-2 dark:text-white">Email address</label>
                                    <div className="relative">
                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-primary-500 focus:ring-primary-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-gray-700 dark:border-gray-600 dark:text-gray-400 dark:focus:ring-primary-400"
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="password" className="block text-sm mb-2 dark:text-white">Password</label>
                                    <div className="relative">
                                        <input
                                            type="password"
                                            id="password"
                                            name="password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-primary-500 focus:ring-primary-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-gray-700 dark:border-gray-600 dark:text-gray-400 dark:focus:ring-primary-400"
                                            required
                                            minLength="8"
                                        />
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1 dark:text-gray-400">
                                        Password must be at least 8 characters, include an uppercase letter and a number.
                                    </p>
                                </div>

                                <div>
                                    <label htmlFor="confirmPassword" className="block text-sm mb-2 dark:text-white">Confirm Password</label>
                                    <div className="relative">
                                        <input
                                            type="password"
                                            id="confirmPassword"
                                            name="confirmPassword"
                                            value={formData.confirmPassword}
                                            onChange={handleChange}
                                            className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-primary-500 focus:ring-primary-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-gray-700 dark:border-gray-600 dark:text-gray-400 dark:focus:ring-primary-400"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="flex items-center">
                                    <div className="flex">
                                        <input
                                            id="terms"
                                            name="terms"
                                            type="checkbox"
                                            className="shrink-0 mt-0.5 border-gray-200 rounded text-primary-600 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:checked:bg-primary-400 dark:checked:border-primary-400 dark:focus:ring-primary-400"
                                            required
                                        />
                                    </div>
                                    <div className="ms-3">
                                        <label htmlFor="terms" className="text-sm dark:text-white">
                                            I accept the <Link to="/terms" className="text-primary-600 decoration-2 hover:underline font-medium dark:text-primary-400">Terms and Conditions</Link>
                                        </label>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    className="w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-primary-600 text-white hover:bg-primary-700 disabled:opacity-50 disabled:pointer-events-none dark:bg-primary-500 dark:hover:bg-primary-600"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? 'Creating account...' : 'Create account'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
} 