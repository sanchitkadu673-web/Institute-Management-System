// ponytail: minimal role resolution helpers. Expand when roles table schema is finalized in BE-01.

export type UserRole = 'admin' | 'faculty' | 'student' | 'parent';

export function getRoleFromSession(user: any): UserRole | null {
  if (!user) return null;
  // Read role from user metadata or app_metadata.
  return (user.app_metadata?.role || user.user_metadata?.role) as UserRole || null;
}

export function redirectToDashboard(role: UserRole | string | null): string {
  switch (role) {
    case 'admin':
      return '/admin/dashboard';
    case 'faculty':
      return '/faculty/dashboard';
    case 'student':
      return '/student/dashboard';
    case 'parent':
      return '/parent/dashboard';
    default:
      return '/unauthorized';
  }
}
