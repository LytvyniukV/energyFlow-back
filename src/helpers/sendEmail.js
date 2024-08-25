import sgMail from '@sendgrid/mail';
import { SEND_GRID_TOKEN, SERVER_HOST } from '../constants/index.js';

sgMail.setApiKey(SEND_GRID_TOKEN);

const sendMailResetPassword = async (email, token) => {
  const mail = await sgMail.send({
    to: email,
    from: 'lytvyniuk.vladyslav@gmail.com',
    subject: 'Reset your password',
    html: `<p>Please, follow the <a href="https://energy-flow-mu.vercel.app/reset-password/${token}">link</a> to reset your password</p>`,
    text: `Please, follow the link https://energy-flow-mu.vercel.app/reset-password/${token} to reset your password`,
  });

  return mail;
};

const sendMailVerify = async (email, verifyToken) => {
  const mail = await sgMail.send({
    to: email,
    from: 'lytvyniuk.vladyslav@gmail.com',
    subject: 'Verify your email',
    html: `<p>Please, follow the <a href="${SERVER_HOST}/api/users/verify/${verifyToken}">link</a> to verify your email</p>`,
    text: `Please, follow the link ${SERVER_HOST}/api/users/verify/${verifyToken} to verify your email`,
  });

  return mail;
};

export default { sendMailResetPassword, sendMailVerify };
