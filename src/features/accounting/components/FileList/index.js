import React from 'react';

const FileList = ({ fileList }) => {
  return (
    <div className="mb-4">
      <h3 className="text-lg font-medium text-gray-800 mb-2">Archivos en el ZIP:</h3>
      <div className="bg-gray-50 p-4 rounded-lg max-h-40 overflow-y-auto border border-gray-200">
        <ul className="list-disc pl-5 space-y-1">
          {fileList.map((fileName, index) => (
            <li key={index} className="text-sm text-gray-700">
              {fileName}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default FileList;
