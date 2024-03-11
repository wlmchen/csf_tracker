import { google } from "googleapis";
import { NextApiRequest, NextApiResponse } from 'next';
import dotenv from 'dotenv';
import NodeCache from 'node-cache';

dotenv.config();

const cache = new NodeCache();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');

        if (req.method === 'OPTIONS') {
            return res.status(200).end();
        }

        const cacheKey = 'volunteerOppsData';
        const cachedData = cache.get(cacheKey);
        if (cachedData) {
            return res.status(200).json({ error: false, data: cachedData });
        }

        const client = new google.auth.JWT(
            process.env.CLIENT_EMAIL, undefined, process.env.PRIVATE_KEY, ['https://www.googleapis.com/auth/spreadsheets']
        );

        client.authorize(async function(err, tokens) {
            if (err) {
                return res.status(400).json({ error: true });
            }

            const gsapi = google.sheets({ version: 'v4', auth: client });

            const opt = {
                spreadsheetId: '1jcno4HUH7TKqvVGPYOmyPoc7OFu6jlSXCn3UjZSuaqY',
                range: 'Volunteer Opps!B16:F'
            };

            try {
                let data = await gsapi.spreadsheets.values.get(opt);

                cache.set(cacheKey, data.data.values, 3600);

                return res.status(200).json({ error: false, data: data.data.values });
            } catch (e) {
                return res.status(400).json({ error: true, message: (e as Error).message });
            }
        });
    } catch (e) {
        return res.status(400).json({ error: true, message: (e as Error).message });
    }
}
