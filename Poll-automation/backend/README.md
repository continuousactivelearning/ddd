## Email Setup for Quiz Notifications

To enable email notifications when a new quiz is created, add the following to your `.env` file in the backend directory:

```
EMAIL_USER=your_gmail_address@gmail.com
EMAIL_PASS=your_gmail_app_password
```

- Use a Gmail account or update the mail utility to use your preferred SMTP provider.
- For Gmail, you may need to generate an App Password if 2FA is enabled. 