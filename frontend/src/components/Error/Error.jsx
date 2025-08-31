import React from 'react';

const Error = ({ message }) => {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-center">
        <h3 className="text-red-500 font-bold mb-4">An error occurred!</h3>
        <p className="text-gray-600">{message || 'Something went wrong. Please try again later.'}</p>
      </div>
    </div>
  );
};

export default Error;