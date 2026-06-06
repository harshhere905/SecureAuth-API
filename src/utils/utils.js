const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

const getOTPhtml = (otp) => {
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <title>OTP Verification</title>
    </head>
    <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
        <div style="max-width: 500px; margin: auto; background: #ffffff; padding: 20px; border-radius: 10px;">
            <h2 style="text-align: center; color: #333;">Verify Your Account</h2>

            <p>Hello,</p>

            <p>Your One-Time Password (OTP) for verification is:</p>

            <div style="text-align: center; margin: 20px 0;">
                <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #2563eb;">
                    ${otp}
                </span>
            </div>

            <p>This OTP is valid for 10 minutes.</p>

            <p>If you did not request this OTP, please ignore this email.</p>

            <hr>

            <p style="font-size: 12px; color: #666;">
                This is an automated message. Please do not reply.
            </p>
        </div>
    </body>
    </html>
    `;
};

export { generateOTP, getOTPhtml };