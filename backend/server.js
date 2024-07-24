const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(bodyParser.json());

const SLACK_WEBHOOK_URL = 'https://hooks.slack.com/services/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'; // Remplacez par votre URL de Webhook Slack

app.post('/send-to-slack', async (req, res) => {
    try {
        const message = req.body;
        const response = await axios.post(SLACK_WEBHOOK_URL, message, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        res.status(200).send('Message envoyé à Slack');
    } catch (error) {
        console.error('Erreur lors de l\'envoi du message à Slack', error);
        res.status(500).send('Erreur lors de l\'envoi du message à Slack');
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Serveur en cours d'exécution sur le port ${PORT}`);
});
