// Generates a fun, unique avatar URL for a user based on their email.
// Uses DiceBear "bottts" style (cute robots) as the default when no Gravatar is set.
// Falls back to a random avatar when no email is provided.
export async function getGravatarUrl(email: string | undefined, size: number) {
  const normalized = email?.trim().toLowerCase()

  // Hash the email for Gravatar lookup + as DiceBear seed
  const seed = normalized ?? 'default-user'
  let hash = ''

  if (typeof crypto !== 'undefined' && crypto.subtle) {
    try {
      const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(seed))
      hash = Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, '0')).join('')
    } catch {
      hash = simpleHash(seed)
    }
  } else {
    hash = simpleHash(seed)
  }

  // Return DiceBear 9.x avatar directly using the hashed email as the seed.
  // This avoids Gravatar's broken WordPress Photon (i1.wp.com) proxy which causes 400 errors on SVG URLs.
  return `https://api.dicebear.com/9.x/bottts/svg?seed=${encodeURIComponent(hash)}&size=${size}`
}

function simpleHash(str: string): string {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i)
    hash |= 0 // Convert to 32bit integer
  }
  return Math.abs(hash).toString(36)
}
