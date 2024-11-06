import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

# BYU-Idaho account credentials
sender_email = "jamesga@byui.edu"
password = "$$$Anguilla76"  # Use your actual password or app-specific password if MFA is enabled

# Email details
receiver_email = "gtjames@gmail.com"
subject = "Test Email from Python via BYU-Idaho Email"
body = "This is a test email sent from Python using my BYU-Idaho email account."

# Set up the MIME
msg = MIMEMultipart()
msg["From"] = sender_email
msg["To"] = receiver_email
msg["Subject"] = subject

# Add body to the email
msg.attach(MIMEText(body, "plain"))

# Send email using Office 365 (Outlook) SMTP server
try:
    with smtplib.SMTP("smtp.office365.com", 587) as server:
        server.starttls()  # Start TLS encryption
        server.login(sender_email, password)  # Log in with BYU-Idaho credentials
        server.sendmail(sender_email, receiver_email, msg.as_string())  # Send the email
    print("Email sent successfully!")
except Exception as e:
    print("Error:", e)