const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const db = require('./config/db');
const { v4: uuidv4 } = require('uuid');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const SLACK_WEBHOOK_URL = 'https://hooks.slack.com/services/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';
const jwtSecret = 'your-jwt-secret';

// Function to send invitation email
async function sendInvitationEmail(email, token) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'aminehazi03@gmail.com',
      pass: 'pass42Rammus0320@mah(){'
    }
  });

  const inviteLink = `http://localhost:3000/register?token=${token}`;

  const mailOptions = {
    from: 'aminehazi03@gmail.com',
    to: email,
    subject: 'Complete Your Registration',
    text: `Please complete your registration using the following link: ${inviteLink}`
  };

  transporter.sendMail(mailOptions, function(error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
}

// Route to handle application submission
app.post('/api/applications', async (req, res) => {
  try {
    const token = uuidv4();
    const applicationData = { ...req.body, token, status: 'pending' };
    const query = 'INSERT INTO applications (email, token, status, first_name, last_name, phone_number, address, profile_description) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *';
    const values = [applicationData.email, applicationData.token, applicationData.status, applicationData.first_name, applicationData.last_name, applicationData.phone_number, applicationData.address, applicationData.profile_description];
    const result = await db.query(query, values);
    await sendInvitationEmail(result.rows[0].email, result.rows[0].token);
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route to handle fetching application data by token
app.get('/api/applications/:token', async (req, res) => {
  try {
    const token = req.params.token;
    const query = 'SELECT * FROM applications WHERE token = $1';
    const values = [token];
    const result = await db.query(query, values);
    if (result.rows.length > 0) {
      res.json(result.rows[0]);
    } else {
      res.status(404).json({ error: 'Application not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route to complete the registration
app.post('/api/complete-registration/:token', async (req, res) => {
  try {
    const token = req.params.token;
    const { password, acceptCGV, signContract } = req.body;

    if (!acceptCGV || !signContract) {
      return res.status(400).json({ message: 'You must accept the CGV and sign the contract.' });
    }

    const query = 'SELECT * FROM applications WHERE token = $1';
    const values = [token];
    const result = await db.query(query, values);

    if (result.rows.length > 0) {
      const application = result.rows[0];
      const hashedPassword = await bcrypt.hash(password, 10);

      const userQuery = 'INSERT INTO users (email, password, first_name, last_name, phone_number, address, profile_description, accept_cgv, sign_contract) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id';
      const userValues = [
        application.email,
        hashedPassword,
        application.first_name || req.body.firstName,
        application.last_name || req.body.lastName,
        application.phone_number || req.body.phoneNumber,
        application.address || req.body.address,
        application.profile_description || req.body.profileDescription,
        acceptCGV,
        signContract
      ];
      const userResult = await db.query(userQuery, userValues);

      const updateQuery = 'UPDATE applications SET status = $1 WHERE token = $2';
      const updateValues = ['completed', token];
      await db.query(updateQuery, updateValues);

      const jwtToken = jwt.sign({ userId: userResult.rows[0].id }, jwtSecret, { expiresIn: '1h' });

      res.status(201).json({ userId: userResult.rows[0].id, token: jwtToken });
    } else {
      res.status(404).json({ error: 'Application not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route to handle login
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const query = 'SELECT * FROM users WHERE email = $1';
    const values = [email];
    const result = await db.query(query, values);

    if (result.rows.length > 0) {
      const user = result.rows[0];
      const isMatch = await bcrypt.compare(password, user.password);

      if (isMatch) {
        const token = jwt.sign({ userId: user.id }, jwtSecret, { expiresIn: '1h' });
        res.json({ token });
      } else {
        res.status(401).json({ message: 'Invalid email or password' });
      }
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route to handle fetching user profile
app.get('/api/profile', async (req, res) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, jwtSecret);
    const query = 'SELECT first_name, last_name FROM users WHERE id = $1';
    const values = [decoded.userId];
    const result = await db.query(query, values);

    if (result.rows.length > 0) {
      res.json(result.rows[0]);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

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
