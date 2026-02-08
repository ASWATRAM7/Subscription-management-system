import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendPasswordResetEmail(email: string, resetToken: string) {
    const resetLink = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`;

    try {
        const { data, error } = await resend.emails.send({
            from: 'SubsERP <onboarding@resend.dev>', // Resend's test email
            to: [email],
            subject: 'Password Reset Request - SubsERP',
            html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <style>
                        body {
                            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                            line-height: 1.6;
                            color: #333;
                            max-width: 600px;
                            margin: 0 auto;
                            padding: 20px;
                        }
                        .container {
                            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                            padding: 40px;
                            border-radius: 10px;
                            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                        }
                        .content {
                            background: white;
                            padding: 30px;
                            border-radius: 8px;
                        }
                        .logo {
                            text-align: center;
                            margin-bottom: 30px;
                        }
                        .logo h1 {
                            color: #667eea;
                            margin: 0;
                            font-size: 32px;
                        }
                        .button {
                            display: inline-block;
                            padding: 14px 30px;
                            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                            color: white !important;
                            text-decoration: none;
                            border-radius: 6px;
                            font-weight: bold;
                            margin: 20px 0;
                        }
                        .footer {
                            text-align: center;
                            margin-top: 30px;
                            color: white;
                            font-size: 12px;
                        }
                        .warning {
                            background: #fff3cd;
                            border-left: 4px solid #ffc107;
                            padding: 12px;
                            margin: 20px 0;
                            border-radius: 4px;
                        }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="content">
                            <div class="logo">
                                <h1>🔐 SubsERP</h1>
                            </div>
                            
                            <h2 style="color: #333; margin-top: 0;">Password Reset Request</h2>
                            
                            <p>Hello,</p>
                            
                            <p>We received a request to reset your password for your SubsERP account. If you didn't make this request, you can safely ignore this email.</p>
                            
                            <p>To reset your password, click the button below:</p>
                            
                            <div style="text-align: center;">
                                <a href="${resetLink}" class="button">Reset Password</a>
                            </div>
                            
                            <p style="color: #666; font-size: 14px;">Or copy and paste this link into your browser:</p>
                            <p style="background: #f5f5f5; padding: 10px; border-radius: 4px; word-break: break-all; font-size: 12px;">
                                ${resetLink}
                            </p>
                            
                            <div class="warning">
                                <strong>⚠️ Security Notice:</strong> This link will expire in 1 hour for your security.
                            </div>
                            
                            <p style="margin-top: 30px; color: #666; font-size: 14px;">
                                If you're having trouble clicking the button, copy and paste the URL above into your web browser.
                            </p>
                        </div>
                        
                        <div class="footer">
                            <p>© ${new Date().getFullYear()} SubsERP. All rights reserved.</p>
                            <p>This is an automated message, please do not reply to this email.</p>
                        </div>
                    </div>
                </body>
                </html>
            `,
        });

        if (error) {
            console.error('Resend error:', error);
            throw new Error(error.message);
        }

        return { success: true, data };
    } catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
}
