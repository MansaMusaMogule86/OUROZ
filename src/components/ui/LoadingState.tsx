/**
 * OUROZ Loading State Component
 * Displays a centered loading spinner with optional message
 */

import React from 'react';

interface LoadingStateProps {
    message?: string;
}

const LoadingState: React.FC<LoadingStateProps> = ({ message = 'Loading...' }) => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center">
                {/* Spinner */}
                <div className="inline-block w-12 h-12 border-4 border-amber-200 border-t-amber-500 rounded-full animate-spin mb-4" />
                <p className="text-gray-600">{message}</p>
            </div>
        </div>
    );
};

export default LoadingState;
