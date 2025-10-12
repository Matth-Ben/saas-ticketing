/**
 * Génère un message d'erreur formaté
 */
export function createError(message: string, statusCode: number = 400) {
  const error = new Error(message) as Error & { statusCode: number }
  error.statusCode = statusCode
  return error
}

/**
 * Valide une adresse email
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Génère un slug à partir d'un texte
 */
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

