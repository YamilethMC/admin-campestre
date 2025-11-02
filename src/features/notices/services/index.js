import { 
  NoticeStatus 
} from '../interfaces';

// Mock data for notices
export const mockNotices = [
  {
    id: '1',
    title: 'Mantenimiento programado en alberca',
    description: 'Se realizará mantenimiento en la alberca principal del 15 al 17 de noviembre. Se suspenderá el servicio temporalmente.',
    isActive: true,
    dateCreated: '2024-11-01',
    dateUpdated: '2024-11-01',
  },
  {
    id: '2',
    title: 'Evento familiar de fin de año',
    description: 'Se realizará un evento familiar el día 20 de diciembre. Se invitan a todos los socios y sus familias.',
    isActive: true,
    dateCreated: '2024-10-28',
    dateUpdated: '2024-10-28',
  },
  {
    id: '3',
    title: 'Cierre temporal del gimnasio',
    description: 'El gimnasio estará temporalmente cerrado para mejoras del 20 al 25 de noviembre.',
    isActive: true,
    dateCreated: '2024-10-15',
    dateUpdated: '2024-10-15',
  },
  {
    id: '4',
    title: 'Nuevas reglas de convivencia',
    description: 'Se han actualizado las reglas de convivencia. Favor de revisarlas en el portal de socios.',
    isActive: false,
    dateCreated: '2024-09-10',
    dateUpdated: '2024-09-10',
    dateCompleted: '2024-10-10',
  },
  {
    id: '5',
    title: 'Emergencia - Corte de agua',
    description: 'Se presentó un corte de agua en la zona norte. Se está trabajando para resolverlo.',
    isActive: true,
    dateCreated: '2024-11-02',
    dateUpdated: '2024-11-02',
  },
];

// Service functions to mock API calls
export const noticeService = {
  // Get all notices
  getNotices: async (filters = {}) => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    let filteredNotices = [...mockNotices];
    
    // Apply status filter
    if (filters.status) {
      if (filters.status === 'activas' || filters.status === NoticeStatus.ACTIVE) {
        filteredNotices = filteredNotices.filter(notice => notice.isActive);
      } else if (filters.status === 'inactivas' || filters.status === NoticeStatus.INACTIVE) {
        filteredNotices = filteredNotices.filter(notice => !notice.isActive);
      }
      // If status is 'todas' or 'all', no additional filtering is needed
    }
    
    // Sort by dateUpdated in descending order (most recently updated/created first)
    filteredNotices.sort((a, b) => new Date(b.dateCreated) - new Date(a.dateCreated));
    
    return filteredNotices;
  },

  // Get notice by id
  getNoticeById: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockNotices.find(notice => notice.id === id);
  },

  // Create a new notice
  createNotice: async (noticeData) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const newNotice = {
      id: Date.now().toString(), // Generate a new ID
      ...noticeData,
      dateCreated: new Date().toISOString().split('T')[0], // Format as YYYY-MM-DD
      dateUpdated: new Date().toISOString().split('T')[0], // Format as YYYY-MM-DD
    };
    
    // Add the new notice to our mock data
    mockNotices.push(newNotice);

    return newNotice;
  },

  // Update a notice
  updateNotice: async (id, noticeData) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const noticeIndex = mockNotices.findIndex(notice => notice.id === id);
    if (noticeIndex === -1) return null;
    
    // Preserve original values that shouldn't be changed
    const originalNotice = mockNotices[noticeIndex];
    
    // Update the notice preserving important fields
    mockNotices[noticeIndex] = {
      ...noticeData,
      id: id,
      dateCreated: originalNotice.dateCreated, // Preserve original creation date
      dateUpdated: new Date().toISOString().split('T')[0], // Update the modification date
    };
    
    return mockNotices[noticeIndex];
  },

  // Toggle notice status (activate/deactivate)
  toggleNoticeStatus: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const noticeIndex = mockNotices.findIndex(notice => notice.id === id);
    if (noticeIndex === -1) return null;
    
    mockNotices[noticeIndex].isActive = !mockNotices[noticeIndex].isActive;
    mockNotices[noticeIndex].dateUpdated = new Date().toISOString().split('T')[0];
    
    return mockNotices[noticeIndex];
  },

  // Get notice statistics for the header
  getNoticeStats: async () => {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const activeCount = mockNotices.filter(notice => notice.isActive).length;
    const inactiveCount = mockNotices.filter(notice => !notice.isActive).length;
    
    return {
      active: activeCount,
      inactive: inactiveCount
    };
  },

  // Delete a notice
  deleteNotice: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const noticeIndex = mockNotices.findIndex(notice => notice.id === id);
    if (noticeIndex === -1) return false;
    
    // Remove the notice
    mockNotices.splice(noticeIndex, 1);
    
    return true;
  },
};