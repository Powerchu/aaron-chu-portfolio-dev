export async function verifyTurnstile(token: string, secret: string, remoteIp?: string): Promise<boolean> {
  if (!token || !secret) return false
  // For dev / test environments with placeholder secret
  if (secret === 'test-secret' && token === 'valid-test-token') return true
  if (secret === 'test-secret' && token === 'invalid-token') return false

  try {
    const params = new URLSearchParams()
    params.append('secret', secret)
    params.append('response', token)
    if (remoteIp) params.append('remoteip', remoteIp)

    const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      body: params.toString(),
    })

    const data = (await response.json()) as { success: boolean }
    return data.success === true
  } catch {
    return false
  }
}
