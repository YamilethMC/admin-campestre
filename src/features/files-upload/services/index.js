// Mock service for file upload
export const fileUploadService = {
  uploadFile: async (fileData) => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));
    
    // Create a mock response
    const mockResponse = {
      id: Date.now().toString(),
      name: fileData.name,
      description: fileData.description,
      originalName: fileData.file.name,
      size: fileData.file.size,
      type: fileData.file.type,
      uploadDate: new Date().toISOString(),
      url: `mock-url-${Date.now()}` // This would be the actual file URL in a real app
    };
    
    // In a real app, this would make an actual API call
    // For now, we're just returning mock data
    
    return mockResponse;
  }
};