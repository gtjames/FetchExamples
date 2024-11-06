import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

# Email account credentials
sender_email = "gtjames@gmail.com"
password = "$$$Anguilla76"

# Email details
receiver_email = "gtjames@gmail.com"
subject = "Subject of the Email"
body = "This is the body of the email."

# Setting up the MIME
msg = MIMEMultipart()
msg["From"] = sender_email
msg["To"] = receiver_email
msg["Subject"] = subject

# Add body to the email
msg.attach(MIMEText(body, "plain"))

# Send the email using an SMTP server
try:
    # Connect to the server
    with smtplib.SMTP("smtp.gmail.com", 587) as server:
        server.starttls()  # Start TLS encryption
        server.login(sender_email, password)  # Login to Outlook account
        server.sendmail(sender_email, receiver_email, msg.as_string())  # Send the email
    print("Email sent successfully!")
except Exception as e:
    print("Error:", e)