export const SplidError = {
  UNAUTHORIZED: {
    error: 'unauthorized',
  },
  ACCESS_DENIED: {
    error: 'Access denied',
    code: 141,
  },
  ACCESS_DENIED_INVALID_CODE: {
    error: 'Access denied: invalid code',
    code: 141,
  },
  ACCESS_DENIED_RATE_LIMITED: {
    error: 'Access denied: too many invalid codes',
    code: 141,
  },
} as const;
