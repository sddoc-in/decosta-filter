


export default function MailTemplate(name: string, otp: number,uid:string,email:string) {

    return `
    <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Email Template</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
        }
        .container {
            width: 100%;
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        h1 {
            color: #333333;
        }
        p {
            color: #666666;
            line-height: 1.6;
        }
        .footer {
            text-align: center;
            padding: 10px;
            background-color: #333333;
            color: #ffffff;
            border-radius: 0 0 8px 8px;
            font-size: 14px;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Hello, ${name}!</h1>
        <p>We received a request to reset your password. Enter the following OTP to reset your password:</p>
        <h2 style="text-align: center; font-size: 36px; color: #333333;">${otp}</h2>
        <p>This OTP is valid for 1 minute only.</p>
        <p> Click <a href="https://facebook.sddoc.in/password/reset/${email}/${uid}">here</a> to reset your password.</p>
        <p>If you didn't request a password reset, you can ignore this email.</p>
        <p>Best Regards,<br>The Team</p>
    </div>
    <div class="footer">
        &copy; 2024 Your Company. All rights reserved.
    </div>
</body>
</html>
`
}