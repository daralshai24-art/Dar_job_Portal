import { Resend } from 'resend';

// REPLACE THIS WITH YOUR API KEY
const resend = new Resend('re_123456789'); // Valid key needed here, but I will use the one from config in next step

async function main() {
    console.log("Sending test email...");
    try {
        const { data, error } = await resend.emails.send({
            from: 'Job Portal <onboarding@resend.dev>',
            to: ['sys.apps.prog@daralshai.com.sa'],
            subject: `Test Email ${new Date().toLocaleTimeString()}`,
            html: '<strong>It works!</strong>',
        });

        if (error) {
            console.error({ error });
        } else {
            console.log({ data });
        }
    } catch (err) {
        console.error(err);
    }
}

main();
