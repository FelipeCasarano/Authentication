import nodemailer from 'nodemailer';
import crypto from 'crypto';

const transport = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
        user: "fa76c8621e9e1a",
        pass: "444e852cc13e7d"
    }
});

export async function sendVerificationEmail(email, baseUrl) {
    const token = crypto.randomBytes(32).toString('hex');
    const verificationLink = `${baseUrl}/api/verify-email?token=${token}&email=${email}`;

    await transport.sendMail({
        from: "felipegc262@outlook.com",
        to: email,
        subject: 'Verifique seu e-mail',
        text: `Por favor, confirme seu e-mail clicando no link abaixo:\n\n${verificationLink}`,
        html: `Por favor, confirme seu e-mail clicando no link abaixo:<br><br><a href="${verificationLink}">${verificationLink}</a>`,
    });

    return token;
}