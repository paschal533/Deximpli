"use server";
import { Resend } from "resend";

const resend = new Resend(process.env.NEXT_PUBLIC_RESEND_API_KEY);

const domain = process.env.NEXT_PUBLIC_APP_URL;

export const sendTwoFactorTokenEmail = async (email: string, token: string) => {
  await resend.emails.send({
    from: "onboarding@resend.dev",
    to: email,
    subject: "2FA code",
    html: `<p>Your 2FA code is <b>${token} </b></p>`,
  });
};

export const sendTransactionEmail = async (
  senderName: string,
  receiverEmail: string,
  amount: string,
) => {
  try {
    const confirmLink = `${domain}/dashboard`;

    await resend.emails.send({
      from: "deximpli@resend.dev",
      to: receiverEmail,
      subject: "Credit alert!",
      html: `<p>We wish to inform you that a credit transaction of $${amount} occured on your email account. The transaction was sent by ${senderName}</b>
            </p>
            <p>Click <a href="${confirmLink}">here</a> to view the transaction.</p>
            `,
    });
  } catch (error) {
    console.log(error);
  }
};
