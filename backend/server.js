const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const db = require('./config/db');
const { v4: uuidv4 } = require('uuid');

const { Admin, ServiceProvider, Client, Service, Availability } = require('./models'); // Adjust the path as necessary

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
      user: 'email@email.com',
      pass: 'password'
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

// Route to update user profile
app.put('/api/profile', async (req, res) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, jwtSecret);
    const { first_name, last_name, email, phone_number, address, profile_description, profile_picture } = req.body;

    const query = 'UPDATE users SET first_name = $1, last_name = $2, email = $3, phone_number = $4, address = $5, profile_description = $6, profile_picture = $7 WHERE id = $8 RETURNING *';
    const values = [first_name, last_name, email, phone_number, address, profile_description, profile_picture, decoded.userId];
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

// Route to handle sending messages to Slack
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

// Route to fetch all applications
app.get('/api/applications', async (req, res) => {
  try {
    const applications = await db.Application.findAll();
    res.json(applications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route to fetch all service providers
app.get('/api/service-providers', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      return res.status(401).json({ message: 'Authorization header missing' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, jwtSecret);

    const query = 'SELECT first_name, last_name, email, phone_number, address, profile_description FROM users WHERE is_admin = false';
    const result = await db.query(query);

    if (result.rows.length > 0) {
      res.json(result.rows);
    } else {
      res.status(404).json({ message: 'No service providers found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route to handle creating a service provider
app.post('/api/service-providers', async (req, res) => {
  try {
    const { first_name, last_name, email, phone_number, address, profile_description, profile_picture, services, availabilities } = req.body;
    const newProvider = await ServiceProvider.create({ first_name, last_name, email, phone_number, address, profile_description, profile_picture, services, availabilities });
    res.status(201).json(newProvider);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route to handle updating a service provider
app.put('/api/service-providers/:id', async (req, res) => {
  try {
    const { first_name, last_name, email, phone_number, address, profile_description, profile_picture, services, availabilities } = req.body;
    const provider = await ServiceProvider.findByPk(req.params.id);
    if (provider) {
      await provider.update({ first_name, last_name, email, phone_number, address, profile_description, profile_picture, services, availabilities });
      res.json(provider);
    } else {
      res.status(404).json({ message: 'ServiceProvider not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route to handle deleting a service provider
app.delete('/api/service-providers/:id', async (req, res) => {
  try {
    const provider = await ServiceProvider.findByPk(req.params.id);
    if (provider) {
      await provider.destroy();
      res.status(204).send();
    } else {
      res.status(404).json({ message: 'ServiceProvider not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route to fetch all clients
app.get('/api/clients', async (req, res) => {
  try {
    const clients = await Client.findAll();
    res.json(clients);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route to handle creating a client
app.post('/api/clients', async (req, res) => {
  try {
    const { first_name, last_name, email, phone_number, address } = req.body;
    const newClient = await Client.create({ first_name, last_name, email, phone_number, address });
    res.status(201).json(newClient);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route to handle updating a client
app.put('/api/clients/:id', async (req, res) => {
  try {
    const { first_name, last_name, email, phone_number, address } = req.body;
    const client = await Client.findByPk(req.params.id);
    if (client) {
      await client.update({ first_name, last_name, email, phone_number, address });
      res.json(client);
    } else {
      res.status(404).json({ message: 'Client not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route to handle deleting a client
app.delete('/api/clients/:id', async (req, res) => {
  try {
    const client = await Client.findByPk(req.params.id);
    if (client) {
      await client.destroy();
      res.status(204).send();
    } else {
      res.status(404).json({ message: 'Client not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route to fetch all services
app.get('/api/services', async (req, res) => {
  try {
    const services = await Service.findAll();
    res.json(services);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route to handle creating a service
app.post('/api/services', async (req, res) => {
  try {
    const { service_type, start_date, end_date, duration, service_provider_id, client_id, animal_count } = req.body;
    const newService = await Service.create({ service_type, start_date, end_date, duration, service_provider_id, client_id, animal_count });
    res.status(201).json(newService);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route to handle updating a service
app.put('/api/services/:id', async (req, res) => {
  try {
    const { service_type, start_date, end_date, duration, service_provider_id, client_id, animal_count } = req.body;
    const service = await Service.findByPk(req.params.id);
    if (service) {
      await service.update({ service_type, start_date, end_date, duration, service_provider_id, client_id, animal_count });
      res.json(service);
    } else {
      res.status(404).json({ message: 'Service not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route to handle deleting a service
app.delete('/api/services/:id', async (req, res) => {
  try {
    const service = await Service.findByPk(req.params.id);
    if (service) {
      await service.destroy();
      res.status(204).send();
    } else {
      res.status(404).json({ message: 'Service not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route to fetch all availabilities
app.get('/api/availabilities', async (req, res) => {
  try {
    const availabilities = await Availability.findAll();
    res.json(availabilities);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route to handle creating an availability
app.post('/api/availabilities', async (req, res) => {
  try {
    const { service_provider_id, service_type, day, start_time, end_time, max_animals } = req.body;
    const newAvailability = await Availability.create({ service_provider_id, service_type, day, start_time, end_time, max_animals });
    res.status(201).json(newAvailability);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route to handle updating an availability
app.put('/api/availabilities/:id', async (req, res) => {
  try {
    const { service_provider_id, service_type, day, start_time, end_time, max_animals } = req.body;
    const availability = await Availability.findByPk(req.params.id);
    if (availability) {
      await availability.update({ service_provider_id, service_type, day, start_time, end_time, max_animals });
      res.json(availability);
    } else {
      res.status(404).json({ message: 'Availability not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route to handle deleting an availability
app.delete('/api/availabilities/:id', async (req, res) => {
  try {
    const availability = await Availability.findByPk(req.params.id);
    if (availability) {
      await availability.destroy();
      res.status(204).send();
    } else {
      res.status(404).json({ message: 'Availability not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Serveur en cours d'exécution sur le port ${PORT}`);
});
