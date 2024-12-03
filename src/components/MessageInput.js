import React from 'react';
import { IoHappy, IoSend } from 'react-icons/io5'; // Importing the necessary icons
import EmojiPicker from 'emoji-picker-react'; // Importing EmojiPicker
import FileUpload from './FileUpload'; // Import the FileUpload component (adjust path if needed)

const MessageInput = ({
  newMessage,
  onMessageChange,
  onSendMessage,
  showEmojiPicker,
  onEmojiClick,
  onToggleEmojiPicker,
  uploadProgress,
  onFileChange
}) => {
  return (
    <div className="p-4 bg-white flex items-center shadow-md z-20">
      <button onClick={onToggleEmojiPicker} className="text-xl">
        <IoHappy />
      </button>

      {showEmojiPicker && <EmojiPicker onEmojiClick={onEmojiClick} />}

      <textarea
        value={newMessage}
        onChange={onMessageChange}
        rows={1}
        className="flex-1 p-2 ml-2 border border-gray-300 rounded-md resize-none"
        placeholder="Type a message"
      />

      {uploadProgress !== null && (
        <div className="w-full mt-2">
          <div className="bg-gray-200 w-full h-2 rounded-lg">
            <div className="bg-blue-500 h-2 rounded-lg" style={{ width: `${uploadProgress}%` }} />
          </div>
          <span className="text-xs text-gray-500">{Math.round(uploadProgress)}% Uploading...</span>
        </div>
      )}

      <FileUpload onFileChange={onFileChange} />

      <button onClick={onSendMessage} className="ml-2 p-2 text-white bg-blue-500 rounded-full">
        <IoSend size={24} />
      </button>
    </div>
  );
};

export default MessageInput;
