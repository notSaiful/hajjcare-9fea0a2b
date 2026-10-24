export const PENDING_INVITE_KEY = "hajj_pending_invite";

export function familyInvitePath(code: string): string {
  return `/family?join=${encodeURIComponent(code.trim())}`;
}

export function familyInviteUrl(code: string): string {
  return `${window.location.origin}${familyInvitePath(code)}`;
}

export function rememberPendingInvite(code: string) {
  sessionStorage.setItem(PENDING_INVITE_KEY, code.trim());
}

export function takePendingInvite(): string | null {
  const code = sessionStorage.getItem(PENDING_INVITE_KEY);
  return code?.trim() || null;
}

export function clearPendingInvite() {
  sessionStorage.removeItem(PENDING_INVITE_KEY);
}
