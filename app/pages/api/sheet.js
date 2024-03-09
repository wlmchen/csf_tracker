import { google } from "googleapis";
import keys from "../../keys.json";

export default function handler(req, res) {
    try {
        const client = new google.auth.JWT(
            keys.client_email, null, keys.private_key, ['https://www.googleapis.com/auth/spreadsheets']
        );

        client.authorize(async function(err, tokens) {
            if (err) {
                return res.status(400).send(JSON.stringify({error: true}));
            }

            const gsapi = google.sheets({version:'v4', auth: client});

            const opt = {
                // spreadsheetId: '1Le5gEylvcypo8OsHeUiQ_6MPzrmjBJKB5lBhsx3WYRQ',
                spreadsheetId: '1jcno4HUH7TKqvVGPYOmyPoc7OFu6jlSXCn3UjZSuaqY',
                // range: 'Sheet1!A2:A'
                range: 'Volunteer Opps!B16:F'
            };

            let data = await gsapi.spreadsheets.values.get(opt);
            return res.status(400).send(JSON.stringify({error: false, data: data.data.values}));
        });
    } catch (e) {
        return res.status(400).send(JSON.stringify({error: true, message: e.message}));
    }
}