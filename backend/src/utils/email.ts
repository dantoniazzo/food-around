import sendgrid from '@sendgrid/mail';
import { env } from '../config/env';

sendgrid.setApiKey(<string>env.email.sendgrid_api_key);

export interface EmailOptions {
  email: string;
  btnText: string;
  btnUrl: string;
  body: string;
  subject: string;
}

export const sendEmail = async (options: EmailOptions) => {
  await sendgrid.send({
    to: options.email,
    from: <string>env.email.user,
    templateId: <string>env.email.template_id,
    dynamicTemplateData: {
      btnText: options.btnText,
      btnUrl: options.btnUrl,
      emailBody: options.body,
      subject: options.subject,
    },
  });
};
