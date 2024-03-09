import { google } from "googleapis";
import { NextApiRequest, NextApiResponse } from 'next';
import dotenv from 'dotenv';

dotenv.config();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        // Allow requests from any origin (you might want to restrict this in production)
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');

        // Respond to preflight requests
        if (req.method === 'OPTIONS') {
            return res.status(200).end();
        }

        const client = new google.auth.JWT(
            process.env.CLIENT_EMAIL, undefined, process.env.PRIVATE_KEY, ['https://www.googleapis.com/auth/spreadsheets']
        );

        client.authorize(async function(err, tokens) {
            if (err) {
                return res.status(400).send(JSON.stringify({ error: true }));
            }

            const gsapi = google.sheets({ version: 'v4', auth: client });

            const opt = {
                // spreadsheetId: '1Le5gEylvcypo8OsHeUiQ_6MPzrmjBJKB5lBhsx3WYRQ',
                spreadsheetId: '1jcno4HUH7TKqvVGPYOmyPoc7OFu6jlSXCn3UjZSuaqY',
                // range: 'Sheet1!A2:A'
                range: 'Volunteer Opps!B16:F'
            };

            let data = await gsapi.spreadsheets.values.get(opt);
            return res.status(200).json({ error: false, data: data.data.values });
        });
    } catch (e) {
        return res.status(400).json({ error: true, message: (e as Error).message });
    }
}