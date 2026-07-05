# 📧 SMTP Setup & OTP Configuration Guide

This guide covers everything you need to properly set up Nodemailer with Gmail SMTP, generate App Passwords, and securely send OTPs.

## ⚠️ Why is your current implementation failing?
Upon reviewing your setup, the main reasons for failure are:
1. **App Password Format**: In your `.env` file, the `EMAIL_PASS` (`wvqm tynw tbfb vjf`) contains spaces. While Google displays the App Password with spaces for readability, Nodemailer typically requires it to be a single continuous 16-character string (`wvqmtynwtbfbvjf`).
2. **Implicit Host Setup**: You are using `service: 'gmail'`. While this works sometimes, it's safer and less prone to DNS or ISP blocking issues to explicitly define the `host`, `port`, and `secure` properties for Gmail.

---

## 🛠️ Step 1: Gmail SMTP Configuration & App Password

To use Gmail for sending emails via an application, you cannot use your regular Gmail password. You must generate an **App Password**.

### Generating an App Password
1. Go to your [Google Account Console](https://myaccount.google.com/).
2. Navigate to the **Security** tab on the left menu.
3. Ensure **2-Step Verification** is turned **ON** (App Passwords will not work without this).
4. Go to **2-Step Verification** settings, scroll to the bottom, and select **App passwords**.
5. Select **App: Other (Custom name)** and name it "Eventora App".
6. Click **Generate**.
7. You will see a 16-character code (e.g., `wvqm tynw tbfb vjf`). **COPY IT AND REMOVE ALL SPACES**.

---

## 🔐 Step 2: Environment Variables (`.env`)

Update your `server/.env` file. Make sure `EMAIL_PASS` has **no spaces** and ideally wrap the variables in quotes to prevent any parsing errors.

```env
PORT=5000
MONGODB_URI="mongodb+srv://sujal:sujal@cluster0.8iyav4u.mongodb.net/EVENTORA?appName=Cluster0"
EMAIL_USER="123alexrai@gmail.com"
EMAIL_PASS="wvqmtynwtbfbvjf"
JWT_SECRET="supersecretjwtkey_eventora"
```

---

## 💻 Step 3: Nodemailer Configuration (`utils/email.js`)

Instead of just relying on `service: 'gmail'`, strictly define the SMTP host. I have updated your `utils/email.js` file to use this more reliable configuration.

```javascript
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // Use true for port 465, false for port 587
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});
```

---

## 🚀 Step 4: OTP Sending Flow
Your current OTP logic (`sendOTPEmail`) in `utils/email.js` is structurally correct. It correctly renders an HTML template and logs the OTP in the console for development. 

**Best Practices Followed:**
- Development logging of OTP.
- Custom titles based on the context (Account Verification vs. Booking).
- Informing the user of the 5-minute expiration timeframe.

---

## 🛡️ Security Best Practices

1. **Never commit your `.env` file**: Ensure `.env` is listed in your `.gitignore` to prevent leaking your MongoDB credentials and Email App Password to GitHub.
2. **Rotate Passwords Periodically**: Revoke the App Password from your Google Account if you ever suspect it has been compromised and generate a new one.
3. **Limit OTP Lifespan**: Ensure your backend logic (in `routes/auth.js` or `models/User.js`) actually enforces the 5-minute expiry mentioned in your email template.
4. **Rate Limiting**: Add a rate-limiter for the OTP generation endpoint to prevent malicious users from spamming an email inbox.

---

## 🔧 Troubleshooting

- **Error: "Invalid login: 535-5.7.8 Username and Password not accepted"**
  - **Fix**: The App Password in your `.env` is wrong, contains spaces, or your Google account has disabled 2-Step Verification.
- **Error: "Connection timeout" / "ETIMEDOUT"**
  - **Fix**: Your firewall, ISP, or antivirus might be blocking port `465`. Try switching to `port: 587` and `secure: false`.
- **Emails going to Spam**
  - **Fix**: Free Gmail accounts are not ideal for production. If emails land in spam, ask users to mark them as "Not Spam" or consider a service like SendGrid, AWS SES, or Resend for production.
