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

  const fromEmail = env.RESEND_FROM_EMAIL?.trim() || 'Combine Drive <noreply@combined.top>'
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
  const supportEmail = 'support@combined.top'

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
      Combine Drive Security · Need help? Contact <a href="mailto:${supportEmail}">${supportEmail}</a><br>
      © ${new Date().getFullYear()} Combine Drive · <a href="${appUrl}">${appUrl}</a>
      <br>
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
 * Sends a confirmation when a new Google Drive account is connected.
 */
export async function sendDriveConnectedEmail(params: {
  to: string
  name: string
  driveEmail: string
  driveName?: string | null
}): Promise<boolean> {
  const appUrl = env.FRONTEND_URL || 'https://www.combined.top'
  const displayName = params.name.trim() || 'there'
  const driveLabel = params.driveName?.trim() || params.driveEmail
  const supportEmail = 'support@combined.top'

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; color: #1e293b; margin: 0; padding: 20px; }
    .container { max-width: 560px; margin: 0 auto; background: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; overflow: hidden; }
    .header { background: linear-gradient(135deg, #2563eb, #4f46e5); padding: 32px 24px; text-align: center; color: #ffffff; }
    .header h1 { margin: 0; font-size: 24px; font-weight: 800; }
    .content { padding: 32px 24px; line-height: 1.6; font-size: 15px; }
    .card { background: #f1f5f9; border-radius: 12px; padding: 16px; margin: 20px 0; }
    .btn { display: inline-block; background: #2563eb; color: #ffffff !important; text-decoration: none; padding: 12px 28px; border-radius: 10px; font-weight: 700; margin: 20px 0; }
    .footer { padding: 20px 24px; text-align: center; font-size: 12px; color: #94a3b8; border-top: 1px solid #f1f5f9; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header"><h1>Google Drive Connected</h1></div>
    <div class="content">
      <p>Hi <strong>${displayName}</strong>,</p>
      <p>A new Google Drive account has been connected to your Combine Drive account.</p>
      <div class="card">
        <strong>Connected Drive:</strong><br>
        ${driveLabel}<br>
        <span style="font-size: 13px; color: #64748b;">${params.driveEmail}</span>
      </div>
      <p>Your available storage has been updated. You can manage your connected accounts from Settings.</p>
      <div style="text-align: center;"><a href="${appUrl}/settings" class="btn">Open Settings</a></div>
    </div>
    <div class="footer">      Combine Drive Security · Need help? Contact <a href="mailto:${supportEmail}">${supportEmail}</a><br>
      © ${new Date().getFullYear()} Combine Drive · <a href="${appUrl}">${appUrl}</a>
      <br>
      <a href="${appUrl}/privacy" style="color: #64748b; text-decoration: underline;">Privacy Policy</a> · <a href="${appUrl}/terms" style="color: #64748b; text-decoration: underline;">Terms of Service</a></div>
  </div>
</body>
</html>
  `.trim()

  return sendEmail({
    to: params.to,
    subject: 'Google Drive connected to Combine Drive',
    html,
    text: `Hi ${displayName}, Google Drive account ${params.driveEmail} was connected to your Combine Drive account. Manage it at ${appUrl}/settings`,
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
  const supportEmail = 'support@combined.top'

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
            Combine Drive Security · Need help? Contact <a href="mailto:${supportEmail}">${supportEmail}</a><br>
      © ${new Date().getFullYear()} Combine Drive · <a href="${appUrl}">${appUrl}</a>
      <br>
      <a href="${appUrl}/privacy" style="color: #64748b; text-decoration: underline;">Privacy Policy</a> · <a href="${appUrl}/terms" style="color: #64748b; text-decoration: underline;">Terms of Service</a>
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

/**
 * Sends a password reset email containing a secure one-time link.
 */
export async function sendPasswordResetEmail(params: {
  to: string
  name: string
  resetUrl: string
  expiresInMinutes?: number
}): Promise<boolean> {
  const appUrl = env.FRONTEND_URL || 'https://www.combined.top'
  const { to, name, resetUrl, expiresInMinutes = 15 } = params
  const displayName = name?.trim() || 'there'
  const supportEmail = 'support@combined.top'

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
    .btn { display: inline-block; background: #2563eb; color: #ffffff !important; text-decoration: none; padding: 13px 30px; border-radius: 10px; font-weight: 700; margin: 20px 0; }
    .warning { background: #fffbeb; border: 1px solid #fef3c7; border-radius: 10px; padding: 14px 18px; margin: 18px 0; font-size: 13px; color: #92400e; }
    .footer { padding: 20px 24px; text-align: center; font-size: 12px; color: #94a3b8; border-top: 1px solid #f1f5f9; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Reset Your Password</h1>
    </div>
    <div class="content">
      <p>Hi <strong>${displayName}</strong>,</p>
      <p>We received a request to reset the password for your Combine Drive account associated with <strong>${to}</strong>.</p>
      
      <div style="text-align: center;">
        <a href="${resetUrl}" class="btn">Reset Password</a>
      </div>

      <div class="warning">
        <strong>Security Notice:</strong> This link will expire in <strong>${expiresInMinutes} minutes</strong>. If you did not request a password reset, you can safely ignore this email — your account remains secure and no changes have been made.
      </div>

      <p style="font-size: 13px; color: #64748b; margin-top: 24px;">
        Button not working? Copy and paste this URL into your browser:<br>
        <span style="word-break: break-all; color: #2563eb;">${resetUrl}</span>
      </p>
    </div>
    <div class="footer">
           Combine Drive Security · Need help? Contact <a href="mailto:${supportEmail}">${supportEmail}</a><br>
      © ${new Date().getFullYear()} Combine Drive · <a href="${appUrl}">${appUrl}</a>
      <br>
      <a href="${appUrl}/privacy" style="color: #64748b; text-decoration: underline;">Privacy Policy</a> · <a href="${appUrl}/terms" style="color: #64748b; text-decoration: underline;">Terms of Service</a>
    </div>
  </div>
</body>
</html>
  `.trim()

  return sendEmail({
    to,
    subject: 'Reset your Combine Drive password',
    html,
    text: `Hi ${displayName}, reset your Combine Drive password by opening: ${resetUrl}. This link expires in ${expiresInMinutes} minutes.`,
  })
}

export async function sendPasswordChangedEmail(params: {
  to: string
  name: string
}): Promise<boolean> {
  const appUrl = env.FRONTEND_URL || 'https://www.combined.top'
  const displayName = params.name.trim() || 'there'
  const supportEmail = 'support@combined.top'

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; color: #1e293b; margin: 0; padding: 20px; }
    .container { max-width: 560px; margin: 0 auto; background: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; overflow: hidden; }
    .header { background: linear-gradient(135deg, #16a34a, #15803d); padding: 28px 24px; text-align: center; color: #ffffff; }
    .header h1 { margin: 0; font-size: 22px; font-weight: 800; }
    .content { padding: 32px 24px; line-height: 1.6; font-size: 15px; }
    .warning { background: #fffbeb; border: 1px solid #fef3c7; border-radius: 10px; padding: 14px 18px; margin: 20px 0; font-size: 13px; color: #92400e; }
    .btn { display: inline-block; background: #16a34a; color: #ffffff !important; text-decoration: none; padding: 12px 28px; border-radius: 10px; font-weight: 700; margin: 20px 0; }
    .footer { padding: 20px 24px; text-align: center; font-size: 12px; color: #94a3b8; border-top: 1px solid #f1f5f9; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header"><h1>Your Password Was Changed</h1></div>
    <div class="content">
      <p>Hi <strong>${displayName}</strong>,</p>
      <p>Your Combine Drive password was changed successfully.</p>
      <div class="warning">
        <strong>Security Notice:</strong> All existing sessions were signed out. If you did not make this change, reset your password again immediately and contact support.
      </div>
      <div style="text-align: center;"><a href="${appUrl}/login" class="btn">Go to Combine Drive</a></div>
    </div>
    <div class="footer">      Combine Drive Security · Need help? Contact <a href="mailto:${supportEmail}">${supportEmail}</a><br>
      © ${new Date().getFullYear()} Combine Drive · <a href="${appUrl}">${appUrl}</a>
      <br>
      <a href="${appUrl}/privacy" style="color: #64748b; text-decoration: underline;">Privacy Policy</a> · <a href="${appUrl}/terms" style="color: #64748b; text-decoration: underline;">Terms of Service</a></div>
  </div>
</body>
</html>
  `.trim()

  return sendEmail({
    to: params.to,
    subject: 'Your Combine Drive password was changed',
    html,
    text: `Hi ${displayName}, your Combine Drive password was changed successfully. All existing sessions were signed out. If you did not make this change, reset your password again immediately and contact support.`,
  })
}

/**
 * Sends an alert email when a connected Google Drive account token expires or is revoked.
 */
export async function sendAccountDisconnectedEmail(params: {
  to: string
  userName?: string
  accountEmail: string
  reason?: string
}): Promise<boolean> {
  const appUrl = env.FRONTEND_URL || 'https://www.combined.top'
  const { to, userName, accountEmail, reason } = params
  const displayName = userName?.trim() || 'there'
  const settingsUrl = `${appUrl}/settings`
  const supportEmail = 'support@combined.top'

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; color: #1e293b; margin: 0; padding: 20px; }
    .container { max-width: 560px; margin: 0 auto; background: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; overflow: hidden; }
    .header { background: linear-gradient(135deg, #ea580c, #dc2626); padding: 28px 24px; text-align: center; color: #ffffff; }
    .header h1 { margin: 0; font-size: 22px; font-weight: 800; }
    .content { padding: 32px 24px; line-height: 1.6; font-size: 15px; }
    .btn { display: inline-block; background: #ea580c; color: #ffffff !important; text-decoration: none; padding: 13px 30px; border-radius: 10px; font-weight: 700; margin: 20px 0; }
    .card { background: #fef2f2; border: 1px solid #fee2e2; border-radius: 10px; padding: 16px; margin: 18px 0; }
    .footer { padding: 20px 24px; text-align: center; font-size: 12px; color: #94a3b8; border-top: 1px solid #f1f5f9; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Action Required: Google Drive Disconnected</h1>
    </div>
    <div class="content">
      <p>Hi <strong>${displayName}</strong>,</p>
      <p>Your connected Google Drive account <strong>${accountEmail}</strong> needs to be re-authorized.</p>
      
      <div class="card">
        <div style="font-size: 13px; font-weight: 700; color: #991b1b; text-transform: uppercase;">
          What happened?
        </div>
        <p style="margin: 6px 0 0; font-size: 14px; color: #7f1d1d;">
          Google reported that the authorization token has expired or access was revoked. File syncing and uploads routed to this account are paused until re-connected.
          ${reason ? `<br><span style="font-size: 12px; opacity: 0.85;">Details: ${reason}</span>` : ''}
        </p>
      </div>

      <div style="text-align: center;">
        <a href="${settingsUrl}" class="btn">Reconnect Drive Account</a>
      </div>

      <p style="font-size: 13px; color: #64748b;">
        Simply go to Settings in your Combine Drive dashboard and click <strong>Connect Drive</strong> to refresh access.
      </p>
    </div>
    <div class="footer">
      Combine Drive Security · Need help? Contact <a href="mailto:${supportEmail}">${supportEmail}</a><br>
      © ${new Date().getFullYear()} Combine Drive · <a href="${appUrl}">${appUrl}</a>
      <br>
      <a href="${appUrl}/privacy" style="color: #64748b; text-decoration: underline;">Privacy Policy</a> · <a href="${appUrl}/terms" style="color: #64748b; text-decoration: underline;">Terms of Service</a>
    </div>
  </div>
</body>
</html>
  `.trim()

  return sendEmail({
    to,
    subject: `Action Required: Reconnect your Google Drive (${accountEmail})`,
    html,
    text: `Hi ${displayName}, your connected Google Drive account ${accountEmail} needs to be reconnected. Please visit ${settingsUrl} to reconnect.`,
  })
}

/**
 * Sends a security alert notification when Entire Google Drive access is enabled for an account.
 * Sent to both the Combine Drive registered email and the connected Google Drive email.
 */
export async function sendFullDriveAccessAlertEmail(params: {
  to: string | string[]
  userName?: string
  accountEmail: string
}): Promise<boolean> {
  const appUrl = env.FRONTEND_URL || 'https://www.combined.top'
  const { to, userName, accountEmail } = params
  const displayName = userName?.trim() || 'User'
  const settingsUrl = `${appUrl}/settings`
  const supportEmail = 'support@combined.top'

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #0f172a; color: #f1f5f9; margin: 0; padding: 24px 16px; }
    .container { max-width: 580px; margin: 0 auto; background: #1e293b; border-radius: 18px; border: 1px solid #334155; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.5); }
    .header { background: linear-gradient(135deg, #b45309, #d97706); padding: 32px 24px; text-align: center; color: #ffffff; }
    .header h1 { margin: 0; font-size: 22px; font-weight: 800; letter-spacing: -0.02em; }
    .content { padding: 32px 28px; line-height: 1.6; font-size: 15px; color: #cbd5e1; }
    .badge { display: inline-block; background: #fef3c7; color: #92400e; font-weight: 800; font-size: 11px; padding: 4px 10px; border-radius: 20px; text-transform: uppercase; margin-bottom: 12px; letter-spacing: 0.05em; }
    .alert-box { background: rgba(245, 158, 11, 0.1); border: 1px solid rgba(245, 158, 11, 0.3); border-radius: 12px; padding: 18px; margin: 20px 0; color: #fef3c7; }
    .steps-box { background: #0f172a; border: 1px solid #334155; border-radius: 12px; padding: 18px 20px; margin: 22px 0; }
    .steps-box h3 { margin: 0 0 12px; font-size: 14px; font-weight: 700; color: #f8fafc; text-transform: uppercase; letter-spacing: 0.04em; }
    .steps-box ol { margin: 0; padding-left: 20px; color: #94a3b8; font-size: 14px; }
    .steps-box li { margin-bottom: 8px; }
    .steps-box li strong { color: #f1f5f9; }
    .btn { display: inline-block; background: #f59e0b; color: #0f172a !important; text-decoration: none; padding: 12px 26px; border-radius: 10px; font-weight: 800; font-size: 14px; margin: 18px 0; box-shadow: 0 4px 14px rgba(245, 158, 11, 0.35); }
    .footer { padding: 22px 24px; text-align: center; font-size: 12px; color: #64748b; border-top: 1px solid #334155; background: #131d31; }
    .footer a { color: #38bdf8; text-decoration: none; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="badge">Security Notice</div>
      <h1>Entire Google Drive Access Enabled</h1>
    </div>
    <div class="content">
      <p>Hi <strong>${displayName}</strong>,</p>
      <p>This is a security notification to inform you that <strong>Entire Google Drive Sync</strong> was just activated for your connected account:</p>
      
      <div style="background: #0f172a; border-radius: 8px; padding: 10px 16px; font-family: monospace; font-size: 14px; color: #38bdf8; margin: 12px 0 18px;">
        ${accountEmail}
      </div>

      <div class="alert-box">
        <strong style="color: #fbbf24;">What this means:</strong><br>
        Files outside the dedicated <code>CombinedDrive</code> folder can now be indexed and previewed in your Combine Drive dashboard. For your safety, <strong>public link generation and invites remain strictly disabled</strong> for these external files.
      </div>

      <div class="steps-box">
        <h3>How to turn it off at any time:</h3>
        <ol>
          <li>Open your <strong>Combine Drive Settings</strong> (<a href="${settingsUrl}" style="color: #38bdf8;">${settingsUrl}</a>).</li>
          <li>Under <strong>Connected Accounts</strong>, select <strong>${accountEmail}</strong>.</li>
          <li>In the <strong>Drive Sync Scope</strong> card, select <strong>CombinedDrive Folder Only (Default)</strong>.</li>
          <li>Click <strong>Revert to CombinedDrive Only</strong>.</li>
        </ol>
        <p style="margin: 8px 0 0; font-size: 12px; color: #64748b;">
          Reverting takes effect instantly, requires no password, and immediately un-indexes all external files from Combine Drive without deleting anything from your Google Drive.
        </p>
      </div>

      <div style="text-align: center;">
        <a href="${settingsUrl}" class="btn">Manage Connected Accounts</a>
      </div>

      <p style="font-size: 13px; color: #94a3b8; margin-top: 24px; border-top: 1px solid #334155; padding-top: 16px;">
        If you did not make this change, please immediately change your CombineDrive password and contact our support team at <a href="mailto:${supportEmail}" style="color: #38bdf8; font-weight: bold;">${supportEmail}</a>.
      </p>
    </div>
    <div class="footer">
      Combine Drive Security · Need help? Contact <a href="mailto:${supportEmail}">${supportEmail}</a><br>
      © ${new Date().getFullYear()} Combine Drive · <a href="${appUrl}">${appUrl}</a>
      <br>
      <a href="${appUrl}/privacy" style="color: #64748b; text-decoration: underline;">Privacy Policy</a> · <a href="${appUrl}/terms" style="color: #64748b; text-decoration: underline;">Terms of Service</a>
    </div>
  </div>
</body>
</html>
  `.trim()

  const plainText = `Hi ${displayName},

Security Notice: Entire Google Drive Sync has been activated for ${accountEmail}.

What this means:
Files outside the dedicated CombinedDrive folder can now be indexed and previewed in your Combine Drive dashboard. Public sharing and collaborator invites remain locked for personal files.

How to turn it off at any time:
1. Go to ${settingsUrl}
2. Select your account ${accountEmail} under Connected Accounts
3. Under "Drive Sync Scope", choose "CombinedDrive Folder Only (Default)" and click Revert.

If you did not authorize this change, please change your password immediately and contact support at ${supportEmail}.
`

  return sendEmail({
    to,
    subject: `Security Alert: Entire Google Drive sync enabled for ${accountEmail}`,
    html,
    text: plainText,
  })
}

