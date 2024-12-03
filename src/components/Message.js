import React from 'react';
import { IoTrash } from 'react-icons/io5';

const Message = ({ message, user, onDelete, onImageClick }) => {
  return (
    <div className={`flex ${message.senderId === user.uid ? 'justify-end' : 'justify-start'} relative`}>
      <div className="relative max-w-xs rounded-lg px-4 py-2 bg-blue-200 text-black">
        {message.fileUrl && message.fileType === 'image' && (
          <div onClick={() => onImageClick(message.fileUrl)}>
            <img src={message.fileUrl} alt="uploaded" className="w-40 h-40 object-cover rounded-lg cursor-pointer" />
          </div>
        )}

        {message.fileUrl && message.fileType === 'pdf' && (
          <a href={message.fileUrl} target="_blank" rel="noopener noreferrer">
            <button className="bg-blue-500 text-white py-2 px-4 rounded-md">Open PDF</button>
          </a>
        )}

        <span>{message.text}</span>

        {message.senderId === user.uid && (
          <button onClick={() => onDelete(message.id)} className="absolute top-0 right-0 p-1 text-xs text-red-500">
            <IoTrash />
          </button>
        )}
      </div>
    </div>
  );
};

export default Message;
