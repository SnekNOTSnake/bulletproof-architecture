import nodemailer from 'nodemailer'
import { MAILGUN_SMTP_PASSWORD, MAILGUN_SMTP_USERNAME } from '../config'

const transporter = nodemailer.createTransport({
	host: 'smtp.mailgun.org',
	port: 587,
	auth: {
		user: MAILGUN_SMTP_USERNAME,
		pass: MAILGUN_SMTP_PASSWORD,
	},
})

type GreetingProps = { to: string }

export const sendGreetingMail = async ({ to }: GreetingProps) => {
	transporter.sendMail({
		from: '"SnekNOTSnake" udintobe@gmail.com',
		to,
		subject: 'Welcome to Bulletproof-Architecture',

		text: `We glad you are here with us. In here, you can do anything you want to your book repository, you can either use it, break it, fix it, trash it, change it, mail, upgrade it, charge it, point it, zoom it, press it, snap it, work it, quick erase it, write it, cut it, paste it, save it, load it, check it, quick rewrite it, plug it, play it, burn it, rip it, drag it, drop it, zip - unzip it, lock it, fill it, call it, find it, view it, code it, jam, unlock it surf it, scroll it, pause it, click it, cross it, crack it, switch, update it, name it, read it, tune it, print it, scan it, send it, fax, rename it, touch it, bring it, pay it, watch it, turn it, leave it, stop, or format it.
			
			Sincerely,
			SnekNOTSnake | Engineer`,

		html: `<p>We glad you are here with us. In here, you can do anything you want to your book repository, you can either use it, break it, fix it, trash it, change it, mail, upgrade it, charge it, point it, zoom it, press it, snap it, work it, quick erase it, write it, cut it, paste it, save it, load it, check it, quick rewrite it, plug it, play it, burn it, rip it, drag it, drop it, zip - unzip it, lock it, fill it, call it, find it, view it, code it, jam, unlock it surf it, scroll it, pause it, click it, cross it, crack it, switch, update it, name it, read it, tune it, print it, scan it, send it, fax, rename it, touch it, bring it, pay it, watch it, turn it, leave it, stop, or format it</p>
			
			<p>
				Sincerely,<br>
				SnekNOTSnake | Engineer
			</p>`,
	})
}
