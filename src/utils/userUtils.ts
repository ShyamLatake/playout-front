import { User, UserType } from "../types";

/**
 * Get userType from roles for backward compatibility
 * Maps roles to userType:
 * - 'admin' role -> 'admin'
 * - 'turf_owner' role -> 'turf_owner'
 * - 'coach' role -> 'coach'
 * - 'normal_user' role -> 'normal_user'
 * - Default: 'normal_user'
 */
export function getUserType(user: User | null | undefined): UserType {
  if (!user) return "normal_user";

  // If userType exists, use it (backward compatibility)
  if (user.userType) {
    return user.userType;
  }

  // Otherwise, derive from roles
  if (user.roles && user.roles.length > 0) {
    if (user.roles.includes("admin")) {
      return "admin";
    }
    if (user.roles.includes("turf_owner")) {
      return "turf_owner";
    }
    if (user.roles.includes("coach")) {
      return "coach";
    }
    if (user.roles.includes("normal_user")) {
      return "normal_user";
    }
    // If roles exist but don't match, return first role as userType
    return user.roles[0] as UserType;
  }

  // Default fallback
  return "normal_user";
}

/**
 * Check if user has a specific role
 */
export function hasRole(user: User | null | undefined, role: string): boolean {
  if (!user || !user.roles) return false;
  return user.roles.includes(role);
}

/**
 * Check if user has any of the specified roles
 */
export function hasAnyRole(
  user: User | null | undefined,
  roles: string[]
): boolean {
  if (!user || !user.roles) return false;
  return roles.some((role) => user.roles!.includes(role));
}

/**
 * Get display name for user type/role
 */
export function getUserTypeDisplay(user: User | null | undefined): string {
  const userType = getUserType(user);
  return userType.replace("_", " ");
}
