import { useState } from 'react';
import { fileUploadService } from '../services';

export const useFileUpload = () => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  const uploadFile = async (fileData) => {
    try {
      setUploading(true);
      setError(null);
      
      const response = await fileUploadService.uploadFile(fileData);
      
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setUploading(false);
    }
  };

  return {
    uploadFile,
    uploading,
    error
  };
};