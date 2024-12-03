import React from 'react';
import { IoHappy } from 'react-icons/io5';
import EmojiPicker from 'emoji-picker-react';

const EmojiPickerButton = ({ showEmojiPicker, onToggle, onEmojiClick }) => {
  return (
    <div>
      <button onClick={onToggle} className="text-xl">
        <IoHappy />
      </button>

      {showEmojiPicker && <EmojiPicker onEmojiClick={onEmojiClick} />}
    </div>
  );
};

export default EmojiPickerButton;
