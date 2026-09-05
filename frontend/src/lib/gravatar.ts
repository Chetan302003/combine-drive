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

  const diceBearUrl = `https://api.dicebear.com/8.x/bottts/svg?seed=${encodeURIComponent(hash)}&size=${size}&backgroundColor=b6e3f4,c0aede,d1f4cc,ffdfbf,ffd5dc`

  if (normalized && hash.length === 64) {
    // Gravatar natively redirects to the fallback image URL (&d=...) when no avatar exists.
    // This avoids preflight HEAD network calls and eliminates 404 errors from browser devtools.
    return `https://www.gravatar.com/avatar/${hash}?s=${size}&d=${encodeURIComponent(diceBearUrl)}`
  }

  return diceBearUrl
}

function simpleHash(str: string): string {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i)
    hash |= 0 // Convert to 32bit integer
  }
  return Math.abs(hash).toString(36)
}
