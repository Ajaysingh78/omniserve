import nodemailer from "nodemailer";



interface SendMailOptions {
  to: string;
  subject: string;
  text: string;
  html: string;
}

export class EmailService {
  static async sendMail(options: SendMailOptions): Promise<boolean> {

    if(!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS)
    throw new Error('Unable to fetch environment variable.')
    
    
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: options.to,
      subject: options.subject,
      text: options.text,
      html: options.html,
    });

    console.info('Mail send to email.', {
      to: options.to,
      subject: options.subject,
      text: options.text,
    });

    return true;
  }
}