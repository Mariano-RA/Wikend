import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'Gmail', // O el servicio que prefieras
      auth: {
        user: 'wikend.turismo.dh@gmail.com',
        pass: 'fzsguctgocvivuma',
      },
    });
  }

  async sendEmail(to: string, subject: string, content: string): Promise<void> {
    const mailOptions = {
      from: 'tu_correo@gmail.com',
      to,
      subject,
      text: content,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log('Correo electrónico enviado exitosamente');
    } catch (error) {
      console.error('Error al enviar el correo electrónico', error);
    }
  }
}
