

export const cardStyles = {
  container: `bg-white rounded-lg shadow p-4 mb-4 border border-gray-200 hover:shadow-md transition-shadow`,
  cardTop: `flex justify-between items-start`,
  imagePlaceholder: `w-16 h-16 bg-gray-200 rounded-lg mr-4 flex-shrink-0 flex items-center justify-center`,
  imagePlaceholderText: `text-gray-500 text-xs`,
  contentContainer: `flex-1 min-w-0`,
  title: `font-semibold text-gray-800 text-lg mb-1 truncate`,
  description: `text-gray-600 text-sm mb-3 line-clamp-2`,
  infoContainer: `flex flex-wrap gap-4 text-sm text-gray-600 mb-3`,
  infoItem: `flex items-center`,
  infoIcon: `w-4 h-4 mr-1`,
  tagsContainer: `flex flex-wrap gap-2`,
  tag: `px-2 py-1 rounded-md text-xs font-medium border`,
  optionsButton: `p-2 rounded-md hover:bg-gray-100 transition-colors`,
  optionsButtonIcon: `w-5 h-5 text-gray-600`,
  optionsMenu: `absolute right-0 w-48 bg-white rounded-md shadow-lg py-1 z-10 border border-gray-200`,
  optionsMenuItem: `block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100`,
  deleteMenuItem: `block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50`,
  statusTag: {
    active: 'bg-green-100 text-green-800 border-green-200',
    inactive: 'bg-gray-100 text-gray-800 border-gray-200',
  },
  priorityTag: {
    URGENT: 'bg-red-100 text-red-800 border-red-200',
    IMPORTANT: 'bg-orange-100 text-orange-800 border-orange-200',
    NORMAL: 'bg-blue-100 text-blue-800 border-blue-200',
    LOW: 'bg-green-100 text-green-800 border-green-200',
  },
  categoryTag: {
    GENERAL: 'bg-gray-100 text-gray-800 border-gray-200',
    SERVICES: 'bg-purple-100 text-purple-800 border-purple-200',
    EVENTS: 'bg-pink-100 text-pink-800 border-pink-200',
    MAINTENANCE: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    EMERGENCY: 'bg-red-100 text-red-800 border-red-200',
  }
};