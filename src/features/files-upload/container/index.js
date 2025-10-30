import React from 'react';
import FileUploadForm from '../components/FileUploadForm';
import FileUploadHeader from '../components/FileUploadHeader';

const FileUploadContainer = () => {
  return (
    <div className="max-w-2xl mx-auto">
      <FileUploadHeader />
      
      <FileUploadForm />
    </div>
  );
};

export default FileUploadContainer;