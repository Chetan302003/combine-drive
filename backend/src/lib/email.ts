import { env } from '../config/env.js'

interface SendEmailParams {
  to: string | string[]
  subject: string
  html: string
  text?: string
}

/**
 * Sends an email using the Resend REST API via native fetch.
 * Does not require any external npm packages.
 */
export async function sendEmail({ to, subject, html, text }: SendEmailParams): Promise<boolean> {
  const apiKey = env.RESEND_API_KEY?.trim()
  if (!apiKey) {
    console.log(`[email] Resend API key not configured. Skipped sending: "${subject}" to ${Array.isArray(to) ? to.join(', ') : to}`)
    return false
  }

  const fromEmail = env.RESEND_FROM_EMAIL?.trim() || 'Combine Drive <onboarding@resend.dev>'
  const recipients = Array.isArray(to) ? to : [to]

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: fromEmail,
        to: recipients,
        subject,
        html,
        text,
      }),
    })

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}))
      console.warn('[email] Resend API error:', res.status, errorData)
      return false
    }

    const data = await res.json()
    console.log(`[email] Sent successfully (ID: ${data.id}) to ${recipients.join(', ')}`)
    return true
  } catch (err: any) {
    console.warn('[email] Failed to send email via Resend:', err.message)
    return false
  }
}

/**
 * Sends a welcome email to newly registered users.
 */
export async function sendWelcomeEmail(to: string, name: string): Promise<boolean> {
  const appUrl = env.FRONTEND_URL || 'https://www.combined.top'
  const displayName = name.trim() || 'there'

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; color: #1e293b; margin: 0; padding: 20px; }
    .container { max-width: 560px; margin: 0 auto; background: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; overflow: hidden; }
    .header { background: linear-gradient(135deg, #2563eb, #4f46e5); padding: 32px 24px; text-align: center; color: #ffffff; }
    .header h1 { margin: 0; font-size: 24px; font-weight: 800; letter-spacing: -0.5px; }
    .header p { margin: 6px 0 0; font-size: 14px; opacity: 0.9; }
    .content { padding: 32px 24px; line-height: 1.6; font-size: 15px; }
    .btn { display: inline-block; background: #2563eb; color: #ffffff !important; text-decoration: none; padding: 12px 28px; border-radius: 10px; font-weight: 700; margin: 20px 0; }
    .card { background: #f1f5f9; border-radius: 12px; padding: 16px; margin: 20px 0; }
    .footer { padding: 20px 24px; text-align: center; font-size: 12px; color: #94a3b8; border-top: 1px solid #f1f5f9; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Welcome to Combine Drive!</h1>
      <p>Your unified cloud storage management gateway</p>
    </div>
    <div class="content">
      <p>Hi <strong>${displayName}</strong>,</p>
      <p>Welcome to <strong>Combine Drive</strong> (combine-drive). Your account is ready, allowing you to connect multiple Google Drive accounts and pool your storage capacity in one dashboard.</p>
      
      <div class="card">
        <strong>Getting Started:</strong>
        <ul style="margin: 8px 0 0; padding-left: 20px;">
          <li>Go to <strong>Settings</strong> and click <strong>Connect Drive</strong>.</li>
          <li>Connect 2 or more Google accounts to aggregate your free space (15GB + 15GB).</li>
          <li>Upload your files — Combine Drive routes them to accounts with available quota.</li>
        </ul>
      </div>

      <div style="text-align: center;">
        <a href="${appUrl}/settings" class="btn">Open Your Dashboard</a>
      </div>

      <p style="font-size: 13px; color: #64748b;">
        Need help? Check our documentation or reply to this email.
      </p>
    </div>
    <div class="footer">
      © ${new Date().getFullYear()} Combine Drive. All rights reserved.<br>
      <a href="${appUrl}/privacy" style="color: #64748b; text-decoration: underline;">Privacy Policy</a> · <a href="${appUrl}/terms" style="color: #64748b; text-decoration: underline;">Terms of Service</a>
    </div>
  </div>
</body>
</html>
  `.trim()

  return sendEmail({
    to,
    subject: 'Welcome to Combine Drive! 🚀',
    html,
    text: `Hi ${displayName}, Welcome to Combine Drive! Access your dashboard at ${appUrl}`,
  })
}

/**
 * Sends an invitation email when a user shares a file or folder.
 */
export async function sendInviteEmail(params: {
  to: string
  inviterName: string
  inviterEmail: string
  targetName: string
  targetType: 'file' | 'folder'
  role: string
  inviteUrl?: string
}): Promise<boolean> {
  const appUrl = env.FRONTEND_URL || 'https://www.combined.top'
  const { to, inviterName, inviterEmail, targetName, targetType, role } = params
  const accessUrl = params.inviteUrl || `${appUrl}/shared`
  const senderLabel = inviterName ? `${inviterName} (${inviterEmail})` : inviterEmail

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; color: #1e293b; margin: 0; padding: 20px; }
    .container { max-width: 560px; margin: 0 auto; background: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; overflow: hidden; }
    .header { background: linear-gradient(135deg, #2563eb, #4f46e5); padding: 28px 24px; text-align: center; color: #ffffff; }
    .header h1 { margin: 0; font-size: 22px; font-weight: 800; }
    .content { padding: 32px 24px; line-height: 1.6; font-size: 15px; }
    .btn { display: inline-block; background: #2563eb; color: #ffffff !important; text-decoration: none; padding: 12px 28px; border-radius: 10px; font-weight: 700; margin: 20px 0; }
    .highlight { background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 10px; padding: 14px 18px; margin: 18px 0; }
    .footer { padding: 20px 24px; text-align: center; font-size: 12px; color: #94a3b8; border-top: 1px solid #f1f5f9; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Shared ${targetType === 'folder' ? 'Folder' : 'File'} Invitation</h1>
    </div>
    <div class="content">
      <p>Hello,</p>
      <p><strong>${senderLabel}</strong> has invited you to collaborate on a ${targetType} on <strong>Combine Drive</strong>.</p>
      
      <div class="highlight">
        <div style="font-size: 12px; font-weight: 700; color: #2563eb; text-transform: uppercase; letter-spacing: 0.5px;">
          ${targetType.toUpperCase()}
        </div>
        <div style="font-size: 18px; font-weight: 800; color: #0f172a; margin-top: 4px;">
          ${targetName}
        </div>
        <div style="font-size: 13px; color: #64748b; margin-top: 4px;">
          Role: <strong>${role === 'editor' ? 'Editor (Read/Write)' : 'Viewer (Read-Only)'}</strong>
        </div>
      </div>

      <div style="text-align: center;">
        <a href="${accessUrl}" class="btn">View ${targetType === 'folder' ? 'Folder' : 'File'}</a>
      </div>

      <p style="font-size: 13px; color: #64748b;">
        If you do not have an account on Combine Drive, register with this email address (<strong>${to}</strong>) to immediately access your shared items.
      </p>
    </div>
    <div class="footer">
      © ${new Date().getFullYear()} Combine Drive · <a href="${appUrl}" style="color: #64748b;">${appUrl}</a>
    </div>
  </div>
</body>
</html>
  `.trim()

  return sendEmail({
    to,
    subject: `${senderLabel} shared "${targetName}" with you on Combine Drive`,
    html,
    text: `${senderLabel} invited you to access "${targetName}" (${targetType}) with ${role} permissions. Open: ${accessUrl}`,
  })
}
