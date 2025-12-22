// Facility interface (using JSDoc comments for type information)
/**
 * @typedef {Object} Facility
 * @property {number} id
 * @property {string} name
 * @property {'PADEL'|'TENNIS'|'GYM'|'OTHER'} type
 * @property {string} [description]
 * @property {'ACTIVE'|'INACTIVE'|'MAINTENANCE'} status
 * @property {string} openTime - Format: "HH:MM:SS" or ISO string
 * @property {string} closeTime - Format: "HH:MM:SS" or ISO string
 * @property {number} maxDuration - In minutes
 * @property {string} createdAt
 * @property {string} updatedAt
 * @property {Reservation[]} [reservations]
 * @property {TimeSlot[]} [availableSlots]
 */

/**
 * @typedef {Object} Reservation
 * @property {number} id
 * @property {string} startTime
 * @property {string} endTime
 * @property {string} status
 */

/**
 * @typedef {Object} TimeSlot
 * @property {string} startTime
 * @property {string} endTime
 */

/**
 * @typedef {Object} FacilityFilters
 * @property {number} page
 * @property {number} limit
 * @property {string} search
 * @property {'ACTIVE'|'INACTIVE'|'MAINTENANCE'|''} status
 * @property {'PADEL'|'TENNIS'|'GYM'|'OTHER'|''} type
 * @property {string} date
 * @property {'asc'|'desc'} order
 * @property {string} orderBy
 */

/**
 * @typedef {Object} FacilityListResponse
 * @property {Facility[]} data
 * @property {Object} meta
 * @property {number} meta.total
 * @property {number} meta.page
 * @property {number} meta.limit
 * @property {number} meta.totalPages
 */

// Export empty object as placeholder since this is an interface-only file
export {};
