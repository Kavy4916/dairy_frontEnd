import React from 'react';

const Message = ({ text }) => {
  return (
    <div className="flex justify-center items-center my-4 mx-4 sm:mx-2 bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-6  w-full">
        <p className="text-gray-800 text-lg text-center">
          {text}
        </p>
      </div>
    </div>
  );
};

export default Message;
