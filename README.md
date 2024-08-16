### Documentation Backend

#### Vue d'ensemble
Cette documentation fournit un aperçu détaillé de l'architecture backend, de la connexion à la base de données et de la gestion des routes pour l'application. Le backend est construit en utilisant Node.js, Express.js, l'ORM Sequelize pour les interactions avec la base de données, et inclut des mécanismes d'authentification et d'autorisation utilisant JWT.

#### Connexion à la base de données
Le fichier de configuration de la base de données (`config/db.js`) utilise Sequelize pour se connecter à une base de données PostgreSQL. Voici comment la connexion est établie :

**config/db.js**
```javascript
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('database', 'username', 'password', {
  host: 'localhost',
  dialect: 'postgres' // ou 'mysql' ou 'sqlite' ou 'mariadb' ou 'mssql'
});

module.exports = sequelize;
```

#### Modèles de la base de données
Les modèles définissent la structure des tables dans la base de données. Chaque modèle est exporté en tant que fonction qui accepte `sequelize` et `DataTypes`, et retourne le modèle.

**models/admin.js**
```javascript
module.exports = (sequelize, DataTypes) => {
  const Admin = sequelize.define('Admin', {
    first_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    last_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    }
  });

  return Admin;
};
```

**models/serviceProvider.js**
```javascript
module.exports = (sequelize, DataTypes) => {
  const ServiceProvider = sequelize.define('ServiceProvider', {
    first_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    last_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    phone_number: {
      type: DataTypes.STRING,
      allowNull: false
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false
    },
    profile_description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    profile_picture: {
      type: DataTypes.STRING,
      allowNull: true
    },
    services: {
      type: DataTypes.ARRAY(DataTypes.ENUM(
        'Garde de chien chez le client', 
        'Garde de chien à mon domicile', 
        'Toilettage de chien', 
        'toilettage de chat', 
        'Promenade de chien en ville', 
        'Promenade de chien en forêt', 
        'Education et comportement', 
        'Garde de chat chez le client', 
        'Garde de chat à mon domicile', 
        'Visite de chat chez le client', 
        'Transport d\'animaux', 
        'Massage et bien-être', 
        'Ostéopathie', 
        'Garde ou visite de Nac'
      )),
      allowNull: false,
      defaultValue: []
    },
    availabilities: {
      type: DataTypes.ARRAY(DataTypes.JSON),
      allowNull: true,
      defaultValue: []
    }
  });

  return ServiceProvider;
};
```

**models/client.js**
```javascript
module.exports = (sequelize, DataTypes) => {
  const Client = sequelize.define('Client', {
    first_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    last_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    phone_number: {
      type: DataTypes.STRING,
      allowNull: false
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false
    }
  });

  return Client;
};
```

**models/service.js**
```javascript
module.exports = (sequelize, DataTypes) => {
  const Service = sequelize.define('Service', {
    service_type: {
      type: DataTypes.ENUM(
        'Garde de chien chez le client', 
        'Garde de chien à mon domicile', 
        'Toilettage de chien', 
        'toilettage de chat', 
        'Promenade de chien en ville', 
        'Promenade de chien en forêt', 
        'Education et comportement', 
        'Garde de chat chez le client', 
        'Garde de chat à mon domicile', 
        'Visite de chat chez le client', 
        'Transport d\'animaux', 
        'Massage et bien-être', 
        'Ostéopathie', 
        'Garde ou visite de Nac'
      ),
      allowNull: false
    },
    start_date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    end_date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    duration: {
      type: DataTypes.INTEGER, // Durée en minutes
      allowNull: false
    },
    service_provider_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    client_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    animal_count: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  });

  return Service;
};
```

**models/availability.js**
```javascript
module.exports = (sequelize, DataTypes) => {
  const Availability = sequelize.define('Availability', {
    service_provider_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    service_type: {
      type: DataTypes.ENUM(
        'Garde de chien chez le client', 
        'Garde de chien à mon domicile', 
        'Toilettage de chien', 
        'toilettage de chat', 
        'Promenade de chien en ville', 
        'Promenade de chien en forêt', 
        'Education et comportement', 
        'Garde de chat chez le client', 
        'Garde de chat à mon domicile', 
        'Visite de chat chez le client', 
        'Transport d\'animaux', 
        'Massage et bien-être', 
        'Ostéopathie', 
        'Garde ou visite de Nac'
      ),
      allowNull: false
    },
    day: {
      type: DataTypes.STRING,
      allowNull: false
    },
    start_time: {
      type: DataTypes.TIME,
      allowNull: false
    },
    end_time: {
      type: DataTypes.TIME,
      allowNull: false
    },
    max_animals: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  });

  return Availability;
};
```

**models/application.js**
```javascript
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db'); // Ajustez le chemin si nécessaire

const Application = sequelize.define('Application', {
  email: {
    type: DataTypes.STRING,
    allowNull: false
  },
  token: {
    type: DataTypes.STRING,
    allowNull: false
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false
  },
  first_name: {
    type: DataTypes.STRING,
    allowNull: true
  },
  last_name: {
    type: DataTypes.STRING,
    allowNull: true
  },
  phone_number: {
    type: DataTypes.STRING,
    allowNull: true
  },
  address: {
    type: DataTypes.STRING,
    allowNull: true
  },
  profile_description: {
    type: DataTypes.TEXT,
    allowNull: true
  }
});

module.exports = Application;
```

**models/index.js**
```javascript
const Admin = require('./admin');
const ServiceProvider = require('./serviceProvider');
const Client = require('./client');
const Service = require('./service');
const Availability = require('./availability');
const Application = require('./application');

module.exports = {
  Admin,
  ServiceProvider,
  Client,
  Service,
  Availability,
  Application
};
```

#### Synchronisation des Modèles avec la Base de Données
Pour synchroniser les modèles avec la base de données et créer les tables nécessaires, utilisez le fichier principal du serveur (e.g., `server.js`).

**server.js**
```javascript
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./config/db'); // Instance Sequelize
const { Admin, ServiceProvider, Client, Service, Availability, Application } = require('./models'); // Modèles

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Authentification et synchronisation de la base de données
db.authenticate()
  .then(() => console.log('Base de données connectée...'))
  .catch(err => console.log('Erreur : ' + err));

db.sync({ alter: true }) // Utilisez { force: true } pour supprimer et recréer les tables, ou { alter: true } pour les mettre à jour sans les supprimer
  .then(() => console.log('Base de données synchronisée...'))
  .catch(err => console.log('Erreur : ' + err));

// Définissez vos routes ici

const

 PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Serveur en cours d'exécution sur le port ${PORT}`);
});
```

# API Routes Documentation

## Routes

The routes define the API entry points to interact with the different entities of the application (e.g., Admins, Service Providers, Clients, Services, Applications).

### Route for Application Registration

- **Description**: This route handles the submission of service provider registration applications. A unique token is generated for each application.
- **Endpoint**: `/api/applications`
- **Method**: POST
- **Parameters**:
  - `email` (string): Candidate's email
  - `first_name` (string): Candidate's first name
  - `last_name` (string): Candidate's last name
  - `phone_number` (string): Candidate's phone number
  - `address` (string): Candidate's address
  - `profile_description` (string): Candidate's profile description
- **Response**: The details of the created application and the sending of the invitation email.

Example response:
```json
{
  "id": 1,
  "email": "example@example.com",
  "token": "unique-token",
  "status": "pending",
  "first_name": "John",
  "last_name": "Doe",
  "phone_number": "1234567890",
  "address": "123 Street, City",
  "profile_description": "Experienced pet sitter."
}
```

### Route to Retrieve Applications by Token

- **Description**: This route retrieves the information of a registration application using the provided unique token.
- **Endpoint**: `/api/applications/:token`
- **Method**: GET
- **Parameters**:
  - `token` (string): Unique application token
- **Response**: The details of the application.

Example response:
```json
{
  "id": 1,
  "email": "example@example.com",
  "token": "unique-token",
  "status": "pending",
  "first_name": "John",
  "last_name": "Doe",
  "phone_number": "1234567890",
  "address": "123 Street, City",
  "profile_description": "Experienced pet sitter."
}
```

### Route to Complete Registration

- **Description**: This route allows candidates to complete their registration by providing a password and accepting the CGV and contract.
- **Endpoint**: `/api/complete-registration/:token`
- **Method**: POST
- **Parameters**:
  - `token` (string): Unique application token
  - `password` (string): User's chosen password
  - `acceptCGV` (boolean): Acceptance of CGV
  - `signContract` (boolean): Contract signature
- **Response**: User creation, updating the application status, and JWT generation.

Example response:
```json
{
  "userId": 1,
  "token": "jwt-token"
}
```

### Route for Login

- **Description**: This route handles user authentication by verifying their email and password.
- **Endpoint**: `/api/login`
- **Method**: POST
- **Parameters**:
  - `email` (string): User's email
  - `password` (string): User's password
- **Response**: JWT if authentication is successful.

Example response:
```json
{
  "token": "jwt-token"
}
```

### Route to Retrieve User Profile

- **Description**: This route allows retrieving the authenticated user's profile information.
- **Endpoint**: `/api/profile`
- **Method**: GET
- **Parameters**:
  - `Authorization` (header): JWT
- **Response**: User profile information.

Example response:
```json
{
  "first_name": "John",
  "last_name": "Doe"
}
```

### Route to Update User Profile

- **Description**: This route allows updating the authenticated user's profile information.
- **Endpoint**: `/api/profile`
- **Method**: PUT
- **Parameters**:
  - `first_name` (string): User's first name
  - `last_name` (string): User's last name
  - `email` (string): User's email
  - `phone_number` (string): User's phone number
  - `address` (string): User's address
  - `profile_description` (string): User's profile description
  - `profile_picture` (string): URL of the user's profile picture
- **Response**: Updated user profile details.

Example response:
```json
{
  "id": 1,
  "first_name": "John",
  "last_name": "Doe",
  "email": "example@example.com",
  "phone_number": "1234567890",
  "address": "123 Street, City",
  "profile_description": "Experienced pet sitter.",
  "profile_picture": "http://example.com/profile.jpg"
}
```

### Route to Send Messages to Slack

- **Description**: This route sends a message to a specified Slack channel.
- **Endpoint**: `/send-to-slack`
- **Method**: POST
- **Parameters**:
  - `message` (string): Message to be sent
- **Response**: Confirmation of message sent.

Example response:
```json
{
  "status": "Message sent to Slack"
}
```

### Route to Retrieve All Applications

- **Description**: This route retrieves all registration applications.
- **Endpoint**: `/api/applications`
- **Method**: GET
- **Response**: List of registration applications.

Example response:
```json
[
  {
    "id": 1,
    "email": "example1@example.com",
    "token": "unique-token-1",
    "status": "pending",
    "first_name": "John",
    "last_name": "Doe",
    "phone_number": "1234567890",
    "address": "123 Street, City",
    "profile_description": "Experienced pet sitter."
  },
  {
    "id": 2,
    "email": "example2@example.com",
    "token": "unique-token-2",
    "status": "completed",
    "first_name": "Jane",
    "last_name": "Smith",
    "phone_number": "0987654321",
    "address": "456 Avenue, City",
    "profile_description": "Professional dog walker."
  }
]
```

### Route to Retrieve All Service Providers

- **Description**: This route retrieves all registered service providers.
- **Endpoint**: `/api/service-providers`
- **Method**: GET
- **Response**: List of service providers.

Example response:
```json
[
  {
    "id": 1,
    "first_name": "John",
    "last_name": "Doe",
    "email": "example@example.com",
    "phone_number": "1234567890",
    "address": "123 Street, City",
    "profile_description": "Experienced pet sitter.",
    "profile_picture": "http://example.com/profile.jpg",
    "services": [
      "Garde de chien chez le client",
      "Promenade de chien en ville"
    ],
    "availabilities": [
      {
        "service_type": "Garde de chien chez le client",
        "day": "Monday",
        "start_time": "09:00",
        "end_time": "12:00",
        "max_animals": 2
      }
    ]
  }
]
```

### Route to Create a Service Provider

- **Description**: This route allows the creation of a new service provider.
- **Endpoint**: `/api/service-providers`
- **Method**: POST
- **Parameters**:
  - `first_name` (string): Service provider's first name
  - `last_name` (string): Service provider's last name
  - `email` (string): Service provider's email
  - `phone_number` (string): Service provider's phone number
  - `address` (string): Service provider's address
  - `profile_description` (string): Service provider's profile description
  - `profile_picture` (string): URL of the service provider's profile picture
  - `services` (array): List of services offered by the provider
  - `availabilities` (array): List of the provider's availabilities
- **Response**: Details of the created service provider.

Example response:
```json
{
  "id": 1,
  "first_name": "John",
  "last_name": "Doe",
  "email": "example@example.com",
  "phone_number": "1234567890",
  "address": "123 Street, City",
  "profile_description": "Experienced pet sitter.",
  "profile_picture": "http://example.com/profile.jpg",
  "services": [
    "Garde de chien chez le client",
    "Promenade de chien en ville"
  ],
  "availabilities": [
    {
      "service_type": "Garde de chien chez le client",
      "day": "Monday",
      "start_time": "09:00",
      "end_time": "12:00",
      "max_animals": 2
    }
  ]
}
```

### Route to Update a Service Provider

- **Description**: This route allows updating an existing service provider's information.
- **Endpoint**: `/api/service-providers/:id`
- **Method**: PUT
- **Parameters**:
  - `first_name` (string): Service provider's first name
  - `last_name` (string): Service provider's last name
  - `email` (string): Service provider's email
  - `phone_number` (string): Service provider's phone number
  - `address

` (string): Service provider's address
  - `profile_description` (string): Service provider's profile description
  - `profile_picture` (string): URL of the service provider's profile picture
  - `services` (array): List of services offered by the provider
  - `availabilities` (array): List of the provider's availabilities
- **Response**: Updated service provider details.

Example response:
```json
{
  "id": 1,
  "first_name": "John",
  "last_name": "Doe",
  "email": "example@example.com",
  "phone_number": "1234567890",
  "address": "123 Street, City",
  "profile_description": "Experienced pet sitter.",
  "profile_picture": "http://example.com/profile.jpg",
  "services": [
    "Garde de chien chez le client",
    "Promenade de chien en ville"
  ],
  "availabilities": [
    {
      "service_type": "Garde de chien chez le client",
      "day": "Monday",
      "start_time": "09:00",
      "end_time": "12:00",
      "max_animals": 2
    }
  ]
}
```

### Route to Delete a Service Provider

- **Description**: This route allows the deletion of an existing service provider.
- **Endpoint**: `/api/service-providers/:id`
- **Method**: DELETE
- **Response**: Deletion confirmation.

Example response:
```json
{
  "status": "ServiceProvider deleted"
}
```

### Route to Retrieve All Clients

- **Description**: This route retrieves all registered clients.
- **Endpoint**: `/api/clients`
- **Method**: GET
- **Response**: List of clients.

Example response:
```json
[
  {
    "id": 1,
    "first_name": "John",
    "last_name": "Doe",
    "email": "example@example.com",
    "phone_number": "1234567890",
    "address": "123 Street, City"
  },
  {
    "id": 2,
    "first_name": "Jane",
    "last_name": "Smith",
    "email": "example2@example.com",
    "phone_number": "0987654321",
    "address": "456 Avenue, City"
  }
]
```

### Route to Create a Client

- **Description**: This route allows the creation of a new client.
- **Endpoint**: `/api/clients`
- **Method**: POST
- **Parameters**:
  - `first_name` (string): Client's first name
  - `last_name` (string): Client's last name
  - `email` (string): Client's email
  - `phone_number` (string): Client's phone number
  - `address` (string): Client's address
- **Response**: Details of the created client.

Example response:
```json
{
  "id": 1,
  "first_name": "John",
  "last_name": "Doe",
  "email": "example@example.com",
  "phone_number": "1234567890",
  "address": "123 Street, City"
}
```

### Route to Update a Client

- **Description**: This route allows updating an existing client's information.
- **Endpoint**: `/api/clients/:id`
- **Method**: PUT
- **Parameters**:
  - `first_name` (string): Client's first name
  - `last_name` (string): Client's last name
  - `email` (string): Client's email
  - `phone_number` (string): Client's phone number
  - `address` (string): Client's address
- **Response**: Updated client details.

Example response:
```json
{
  "id": 1,
  "first_name": "John",
  "last_name": "Doe",
  "email": "example@example.com",
  "phone_number": "1234567890",
  "address": "123 Street, City"
}
```

### Route to Delete a Client

- **Description**: This route allows the deletion of an existing client.
- **Endpoint**: `/api/clients/:id`
- **Method**: DELETE
- **Response**: Deletion confirmation.

Example response:
```json
{
  "status": "Client deleted"
}
```

### Route to Retrieve All Services

- **Description**: This route retrieves all registered services.
- **Endpoint**: `/api/services`
- **Method**: GET
- **Response**: List of services.

Example response:
```json
[
  {
    "id": 1,
    "service_type": "Garde de chien chez le client",
    "start_date": "2024-08-01T09:00:00Z",
    "end_date": "2024-08-01T10:00:00Z",
    "duration": 60,
    "service_provider_id": 1,
    "client_id": 1,
    "animal_count": 1
  },
  {
    "id": 2,
    "service_type": "Promenade de chien en ville",
    "start_date": "2024-08-02T14:00:00Z",
    "end_date": "2024-08-02T15:00:00Z",
    "duration": 60,
    "service_provider_id": 2,
    "client_id": 2,
    "animal_count": 2
  }
]
```

### Route to Create a Service

- **Description**: This route allows the creation of a new service.
- **Endpoint**: `/api/services`
- **Method**: POST
- **Parameters**:
  - `service_type` (string): Type of service
  - `start_date` (date): Start date of the service
  - `end_date` (date): End date of the service
  - `duration` (integer): Duration of the service in minutes
  - `service_provider_id` (integer): ID of the service provider
  - `client_id` (integer): ID of the client
  - `animal_count` (integer): Number of animals involved in the service
- **Response**: Details of the created service.

Example response:
```json
{
  "id": 1,
  "service_type": "Garde de chien chez le client",
  "start_date": "2024-08-01T09:00:00Z",
  "end_date": "2024-08-01T10:00:00Z",
  "duration": 60,
  "service_provider_id": 1,
  "client_id": 1,
  "animal_count": 1
}
```

### Route to Update a Service

- **Description**: This route allows updating an existing service's information.
- **Endpoint**: `/api/services/:id`
- **Method**: PUT
- **Parameters**:
  - `service_type` (string): Type of service
  - `start_date` (date): Start date of the service
  - `end_date` (date): End date of the service
  - `duration` (integer): Duration of the service in minutes
  - `service_provider_id` (integer): ID of the service provider
  - `client_id` (integer): ID of the client
  - `animal_count` (integer): Number of animals involved in the service
- **Response**: Updated service details.

Example response:
```json
{
  "id": 1,
  "service_type": "Garde de chien chez le client",
  "start_date": "2024-08-01T09:00:00Z",
  "end_date": "2024-08-01T10:00:00Z",
  "duration": 60,
  "service_provider_id": 1,
  "client_id": 1,
  "animal_count": 1
}
```

### Route to Delete a Service

- **Description**: This route allows the deletion of an existing service.
- **Endpoint**: `/api/services/:id`
- **Method**: DELETE
- **Response**: Deletion confirmation.

Example response:
```json
{
  "status": "Service deleted"
}
```

### Route to Retrieve All Availabilities

- **Description**: This route retrieves all availabilities of service providers.
- **Endpoint**: `/api/availabilities`
- **Method**: GET
- **Response**: List of availabilities.

Example response:
```json
[
  {
    "id": 1,
    "service_provider_id": 1,
    "service_type": "Garde de chien chez le client",
    "day": "Monday",
    "start_time": "09:00",
    "end_time": "12:00",
    "max_animals": 2
  },
  {
    "id": 2,
    "service_provider_id": 2,
    "service_type": "Promenade de chien en ville",
    "day": "Tuesday",
    "start_time": "14:00",
    "end_time": "17:00",
    "max_animals": 3
  }
]
```

### Route to Create Availability

- **Description**: This route allows the creation of a new availability for a service provider.
- **Endpoint**: `/api/availabilities`
- **Method**: POST
- **Parameters**:
  - `service_provider_id` (integer): ID of the service provider
  - `service_type` (string):

 Type of service
  - `day` (string): Day of the week
  - `start_time` (time): Start time
  - `end_time` (time): End time
  - `max_animals` (integer): Maximum number of animals
- **Response**: Details of the created availability.

Example response:
```json
{
  "id": 1,
  "service_provider_id": 1,
  "service_type": "Garde de chien chez le client",
  "day": "Monday",
  "start_time": "09:00",
  "end_time": "12:00",
  "max_animals": 2
}
```

### Route to Update Availability

- **Description**: This route allows updating an existing availability's information.
- **Endpoint**: `/api/availabilities/:id`
- **Method**: PUT
- **Parameters**:
  - `service_provider_id` (integer): ID of the service provider
  - `service_type` (string): Type of service
  - `day` (string): Day of the week
  - `start_time` (time): Start time
  - `end_time` (time): End time
  - `max_animals` (integer): Maximum number of animals
- **Response**: Updated availability details.

Example response:
```json
{
  "id": 1,
  "service_provider_id": 1,
  "service_type": "Garde de chien chez le client",
  "day": "Monday",
  "start_time": "09:00",
  "end_time": "12:00",
  "max_animals": 2
}
```

### Route to Delete Availability

- **Description**: This route allows the deletion of an existing availability.
- **Endpoint**: `/api/availabilities/:id`
- **Method**: DELETE
- **Response**: Deletion confirmation.

Example response:
```json
{
  "status": "Availability deleted"
}
```

