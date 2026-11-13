import 'dotenv/config';
import nodemailer from 'nodemailer';

let transporter;

function getTransporter() {
    if (transporter) {
        return transporter;
    }

    const {
        SMTP_HOST,
        SMTP_PORT,
        SMTP_USER,
        SMTP_PASSWORD,
        MAIL_FROM
    } = process.env;

    const port = Number(SMTP_PORT);

    if (
        !SMTP_HOST ||
        !SMTP_USER ||
        !SMTP_PASSWORD ||
        !MAIL_FROM ||
        !Number.isInteger(port) ||
        port < 1 ||
        port > 65535
    ) {
        const error = new Error('Configuração SMTP incompleta ou inválida.');
        error.code = 'SMTP_CONFIG_INVALID';
        throw error;
    }

    transporter = nodemailer.createTransport({
        host: SMTP_HOST,
        port,
        secure: port === 465,
        requireTLS: port !== 465,
        auth: {
            user: SMTP_USER,
            pass: SMTP_PASSWORD
        },
        connectionTimeout: 10000,
        socketTimeout: 20000
    });

    return transporter;
}

export async function sendPasswordResetEmail({ to, name, resetUrl }) {
    await getTransporter().sendMail({
        from: process.env.MAIL_FROM,
        to: { address: to },
        subject: 'Polvinho — Redefinição de senha',
        text: [
            `Olá, ${name}!`,
            '',
            'Recebemos uma solicitação para redefinir sua senha.',
            'Acesse o link abaixo para escolher uma nova senha:',
            '',
            resetUrl,
            '',
            'Este link expira em 1 hora.',
            'Se você não solicitou a redefinição, ignore este e-mail.'
        ].join('\n')
    });
}