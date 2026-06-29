/** Routes that render inside the app workspace shell (left sidebar). */
export const APP_PREFIXES = [];

export function isAppRoute(pathname) {
  return APP_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`));
}

/**
 * Workspace navigation — empty until the investor portal / admin CRM
 * (later phases of the Bloomvest Property pivot) are built.
 */
export const SIDEBAR_SECTIONS = [];
