import React from 'react';
import { IoAttach } from 'react-icons/io5';

const FileUpload = ({ onFileChange }) => {
  return (
    <div>
      <input
        type="file"
        id="file-input"
        onChange={onFileChange}
        className="hidden"
        accept="image/*,application/pdf"
      />
      <label htmlFor="file-input" className="cursor-pointer">
        <IoAttach size={24} />
      </label>
    </div>
  );
};

export default FileUpload;
