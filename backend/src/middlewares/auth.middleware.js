import { auth } from '../lib/auth.js';
import { ROLES } from '../models/index.js';

export const authenticate = async (request, reply) => {
  try {
    // Debug: log cookies
    console.log('Auth middleware - cookies:', request.headers.cookie);
    
    const session = await auth.api.getSession({
      headers: request.headers
    });

    console.log('Auth middleware - session:', session ? 'found' : 'not found');

    if (!session) {
      return reply.status(401).send({
        success: false,
        message: 'Unauthorized'
      });
    }

    request.user = session.user;
    request.session = session.session;
  } catch (err) {
    console.error('Auth middleware error:', err);
    return reply.status(401).send({
      success: false,
      message: 'Unauthorized'
    });
  }
};

export const requireRole = (...allowedRoles) => {
  return async (request, reply) => {
    await authenticate(request, reply);
    
    if (reply.sent) return;

    const userRoleId = request.user?.role_id || ROLES.USER;

    // Convert role names to IDs if strings passed
    const allowedRoleIds = allowedRoles.map(role => {
      if (typeof role === 'string') {
        return ROLES[role.toUpperCase()] || role;
      }
      return role;
    });

    // Admin has access to everything
    if (userRoleId === ROLES.ADMIN) return;

    if (!allowedRoleIds.includes(userRoleId)) {
      return reply.status(403).send({
        success: false,
        message: 'Forbidden: insufficient permissions'
      });
    }
  };
};

// Shorthand middlewares
export const requireAdmin = requireRole(ROLES.ADMIN);
export const requireModerator = requireRole(ROLES.MODERATOR, ROLES.ADMIN);
export const requireCreator = requireRole(ROLES.CREATOR, ROLES.MODERATOR, ROLES.ADMIN);

export const optionalAuth = async (request, reply) => {
  try {
    const session = await auth.api.getSession({
      headers: request.headers
    });
    
    if (session) {
      request.user = session.user;
      request.session = session.session;
    }
  } catch {
    // Continue without auth
  }
};
