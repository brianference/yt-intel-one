/**
 * The only file that changes when the auth kit is ported to a new app.
 * See RedAnvil/design-system/auth-kit/README.md.
 */
export type AppConfig = {
  name: string
  cookieName: string
  brandColor: string
  textColor: string
  mutedColor: string
  // Shares fleet-shared-db with the other fleet apps. This scope is what keeps
  // the user bases separate; without it, registering here would hand you an
  // account on the neighbours.
  scope: 'yt-intel-one',
  accountPurpose: string
}

export const APP: AppConfig = {
  name: 'YouTube Intel',
  // Unique per app: a shared cookie name under *.pages.dev would let one app
  // receive another app's session.
  cookieName: 'ytintel_session',
  brandColor: '#1e293b',
  textColor: '#0f172a',
  mutedColor: '#64748b',
  // Shares fleet-shared-db with the other fleet apps. This scope is what keeps
  // the user bases separate; without it, registering here would hand you an
  // account on the neighbours.
  scope: 'yt-intel-one',
  accountPurpose:
    'You received this because you save channel scans on YouTube Intel. Insights are grounded in real transcripts, never invented.',
}
