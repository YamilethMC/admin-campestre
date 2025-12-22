// JSDoc type definitions for auth feature

/**
 * @typedef {Object} LoginFormState
 * @property {string} username - Username input value
 * @property {string} password - Password input value
 */

/**
 * @typedef {Object} LoginCredentials
 * @property {string} username - The username for login
 * @property {string} password - The password for login
 */

/**
 * @typedef {Object} LoginResult
 * @property {boolean} success - Whether the login was successful
 * @property {string} [message] - Optional message about the login result
 */

/**
 * @typedef {Object} AuthService
 * @property {function(LoginCredentials): Promise<LoginResult>} login - Perform login with credentials
 */
