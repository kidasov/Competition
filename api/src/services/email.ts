import FormData from 'form-data';
import MailGun from 'mailgun.js';

const DOMAIN = '';
const KEY = '';

type MessageParams = {
  from: string;
  to: [string];
  text?: string;
  subject?: string;
  html?: string;
};

class EmailService {
  private mailgun = new MailGun(FormData);
  private mg = this.mailgun.client({
    username: 'api',
    key: KEY,
  });
  private static instance: EmailService;

  private constructor() {}

  public static getInstance(): EmailService {
    if (!EmailService.instance) {
      EmailService.instance = new EmailService();
    }

    return EmailService.instance;
  }

  public async createMessage(params: MessageParams) {
    await this.mg.messages.create(DOMAIN, params);    
  }
}

export default EmailService;