import sgMail from '@sendgrid/mail';
import type { InsertContactMessage } from '@shared/schema';

// Initialize SendGrid
if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

export async function sendContactEmail(contactData: InsertContactMessage): Promise<boolean> {
  if (!process.env.SENDGRID_API_KEY) {
    console.error('SendGrid API key not configured');
    return false;
  }

  try {
    const msg = {
      to: 'remiguillette@gmail.com',
      from: 'noreply@remiguillette.com', // This needs to be a verified sender in SendGrid
      subject: `Nouveau message de contact - ${contactData.firstName} ${contactData.lastName}`,
      html: `
        <h2>Nouveau message de contact</h2>
        <p><strong>Nom:</strong> ${contactData.firstName} ${contactData.lastName}</p>
        <p><strong>Email:</strong> ${contactData.email}</p>
        <p><strong>Service:</strong> ${contactData.service || 'Non spécifié'}</p>
        <p><strong>Message:</strong></p>
        <div style="background: #f5f5f5; padding: 15px; border-radius: 5px; margin: 10px 0;">
          ${contactData.message.replace(/\n/g, '<br>')}
        </div>
        <p><strong>Date:</strong> ${new Date().toLocaleString('fr-FR')}</p>
      `,
      text: `
        Nouveau message de contact
        
        Nom: ${contactData.firstName} ${contactData.lastName}
        Email: ${contactData.email}
        Service: ${contactData.service || 'Non spécifié'}
        
        Message:
        ${contactData.message}
        
        Date: ${new Date().toLocaleString('fr-FR')}
      `
    };

    await sgMail.send(msg);
    console.log('Contact email sent successfully');
    return true;
  } catch (error) {
    console.error('Error sending contact email:', error);
    return false;
  }
}