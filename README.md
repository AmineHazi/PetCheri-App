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

# Documentation des Routes API

## Routes

Les routes définissent les points d'entrée de l'API pour interagir avec les différentes entités de l'application (e.g., Admins, Prestataires de services, Clients, Services, Applications).

### Route d'inscription des applications

- **Description** : Cette route gère la soumission des demandes d'inscription des prestataires de services. Un jeton unique est généré pour chaque demande.
- **Endpoint** : `/api/applications`
- **Méthode** : POST
- **Paramètres** :
  - `email` (string) : Email du candidat
  - `first_name` (string) : Prénom du candidat
  - `last_name` (string) : Nom de famille du candidat
  - `phone_number` (string) : Numéro de téléphone du candidat
  - `address` (string) : Adresse du candidat
  - `profile_description` (string) : Description du profil du candidat
- **Réponse** : Les détails de la demande créée et l'envoi de l'email d'invitation.

Exemple de réponse :
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
  "profile_description": "Expérience de garde d'animaux."
}
```

### Route de récupération des applications par jeton

- **Description** : Cette route récupère les informations d'une demande d'inscription à partir du jeton unique fourni.
- **Endpoint** : `/api/applications/:token`
- **Méthode** : GET
- **Paramètres** :
  - `token` (string) : Jeton unique de la demande
- **Réponse** : Les détails de la demande.

Exemple de réponse :
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
  "profile_description": "Expérience de garde d'animaux."
}
```

### Route de finalisation de l'inscription

- **Description** : Cette route permet aux candidats de compléter leur inscription en fournissant un mot de passe et en acceptant les CGV et le contrat.
- **Endpoint** : `/api/complete-registration/:token`
- **Méthode** : POST
- **Paramètres** :
  - `token` (string) : Jeton unique de la demande
  - `password` (string) : Mot de passe choisi par l'utilisateur
  - `acceptCGV` (boolean) : Acceptation des CGV
  - `signContract` (boolean) : Signature du contrat
- **Réponse** : Création de l'utilisateur, mise à jour de l'état de la demande et génération d'un jeton JWT.

Exemple de réponse :
```json
{
  "userId": 1,
  "token": "jwt-token"
}
```

### Route de connexion

- **Description** : Cette route gère l'authentification des utilisateurs en vérifiant leur email et mot de passe.
- **Endpoint** : `/api/login`
- **Méthode** : POST
- **Paramètres** :
  - `email` (string) : Email de l'utilisateur
  - `password` (string) : Mot de passe de l'utilisateur
- **Réponse** : Jeton JWT si l'authentification réussie.

Exemple de réponse :
```json
{
  "token": "jwt-token"
}
```

### Route de récupération du profil utilisateur

- **Description** : Cette route permet de récupérer les informations du profil de l'utilisateur authentifié.
- **Endpoint** : `/api/profile`
- **Méthode** : GET
- **Paramètres** :
  - `Authorization` (header) : Jeton JWT
- **Réponse** : Informations du profil utilisateur.

Exemple de réponse :
```json
{
  "first_name": "John",
  "last_name": "Doe"
}
```

### Route de mise à jour du profil utilisateur

- **Description** : Cette route permet de mettre à jour les informations du profil de l'utilisateur authentifié.
- **Endpoint** : `/api/profile`
- **Méthode** : PUT
- **Paramètres** :
  - `first_name` (string) : Prénom de l'utilisateur
  - `last_name` (string) : Nom de famille de l'utilisateur
  - `email` (string) : Email de l'utilisateur
  - `phone_number` (string) : Numéro de téléphone de l'utilisateur
  - `address` (string) : Adresse de l'utilisateur
  - `profile_description` (string) : Description du profil de l'utilisateur
  - `profile_picture` (string) : URL de la photo de profil de l'utilisateur
- **Réponse** : Les détails mis à jour du profil utilisateur.

Exemple de réponse :
```json
{
  "id": 1,
  "first_name": "John",
  "last_name": "Doe",
  "email": "example@example.com",
  "phone_number": "1234567890",
  "address": "123 Street, City",
  "profile_description": "Expérience de garde d'animaux.",
  "profile_picture": "http://example.com/profile.jpg"
}
```

### Route d'envoi de messages à Slack

- **Description** : Cette route envoie un message à un canal Slack spécifié.
- **Endpoint** : `/send-to-slack`
- **Méthode** : POST
- **Paramètres** :
  - `message` (string) : Message à envoyer
- **Réponse** : Confirmation de l'envoi du message.

Exemple de réponse :
```json
{
  "status": "Message envoyé à Slack"
}
```

### Route de récupération de toutes les demandes d'inscription

- **Description** : Cette route récupère toutes les demandes d'inscription.
- **Endpoint** : `/api/applications`
- **Méthode** : GET
- **Réponse** : Liste des demandes d'inscription.

Exemple de réponse :
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
    "profile_description": "Expérience de garde d'animaux."
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
    "profile_description": "Promeneuse de chien professionnelle."
  }
]
```

### Route de récupération de tous les prestataires de services

- **Description** : Cette route récupère tous les prestataires de services enregistrés.
- **Endpoint** : `/api/service-providers`
- **Méthode** : GET
- **Réponse** : Liste des prestataires de services.

Exemple de réponse :
```json
[
  {
    "id": 1,
    "first_name": "John",
    "last_name": "Doe",
    "email": "example@example.com",
    "phone_number": "1234567890",
    "address": "123 Street, City",
    "profile_description": "Expérience de garde d'animaux.",
    "profile_picture": "http://example.com/profile.jpg",
    "services": [
      "Garde de chien chez le client",
      "Promenade de chien en ville"
    ],
    "availabilities": [
      {
        "service_type": "Garde de chien chez le client",
        "day": "Lundi",
        "start_time": "09:00",
        "end_time": "12:00",
        "max_animals": 2
      }
    ]
  }
]
```

### Route de création d'un prestataire de services

- **Description** : Cette route permet de créer un nouveau prestataire de services.
- **Endpoint** : `/api/service-providers`
- **Méthode** : POST
- **Paramètres** :
  - `first_name` (string) : Prénom du prestataire de services
  - `last_name` (string) : Nom de famille du prestataire de services
  - `email` (string) : Email du prestataire de services
  - `phone_number` (string) : Numéro de téléphone du prestataire de services
  - `address` (string) : Adresse du prestataire de services
  - `profile_description` (string) : Description du profil du prestataire de services
  - `profile_picture` (string) : URL de la photo de profil du prestataire de services
  - `services` (array) : Liste des services offerts par le prestataire
  - `availabilities` (array) : Liste des disponibilités du prestataire
- **Réponse** : Détails du prestataire de

 services créé.

Exemple de réponse :
```json
{
  "id": 1,
  "first_name": "John",
  "last_name": "Doe",
  "email": "example@example.com",
  "phone_number": "1234567890",
  "address": "123 Street, City",
  "profile_description": "Expérience de garde d'animaux.",
  "profile_picture": "http://example.com/profile.jpg",
  "services": [
    "Garde de chien chez le client",
    "Promenade de chien en ville"
  ],
  "availabilities": [
    {
      "service_type": "Garde de chien chez le client",
      "day": "Lundi",
      "start_time": "09:00",
      "end_time": "12:00",
      "max_animals": 2
    }
  ]
}
```

### Route de mise à jour d'un prestataire de services

- **Description** : Cette route permet de mettre à jour les informations d'un prestataire de services existant.
- **Endpoint** : `/api/service-providers/:id`
- **Méthode** : PUT
- **Paramètres** :
  - `first_name` (string) : Prénom du prestataire de services
  - `last_name` (string) : Nom de famille du prestataire de services
  - `email` (string) : Email du prestataire de services
  - `phone_number` (string) : Numéro de téléphone du prestataire de services
  - `address` (string) : Adresse du prestataire de services
  - `profile_description` (string) : Description du profil du prestataire de services
  - `profile_picture` (string) : URL de la photo de profil du prestataire de services
  - `services` (array) : Liste des services offerts par le prestataire
  - `availabilities` (array) : Liste des disponibilités du prestataire
- **Réponse** : Détails mis à jour du prestataire de services.

Exemple de réponse :
```json
{
  "id": 1,
  "first_name": "John",
  "last_name": "Doe",
  "email": "example@example.com",
  "phone_number": "1234567890",
  "address": "123 Street, City",
  "profile_description": "Expérience de garde d'animaux.",
  "profile_picture": "http://example.com/profile.jpg",
  "services": [
    "Garde de chien chez le client",
    "Promenade de chien en ville"
  ],
  "availabilities": [
    {
      "service_type": "Garde de chien chez le client",
      "day": "Lundi",
      "start_time": "09:00",
      "end_time": "12:00",
      "max_animals": 2
    }
  ]
}
```

### Route de suppression d'un prestataire de services

- **Description** : Cette route permet de supprimer un prestataire de services existant.
- **Endpoint** : `/api/service-providers/:id`
- **Méthode** : DELETE
- **Réponse** : Confirmation de la suppression.

Exemple de réponse :
```json
{
  "status": "ServiceProvider deleted"
}
```

### Route de récupération de tous les clients

- **Description** : Cette route récupère tous les clients enregistrés.
- **Endpoint** : `/api/clients`
- **Méthode** : GET
- **Réponse** : Liste des clients.

Exemple de réponse :
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

### Route de création d'un client

- **Description** : Cette route permet de créer un nouveau client.
- **Endpoint** : `/api/clients`
- **Méthode** : POST
- **Paramètres** :
  - `first_name` (string) : Prénom du client
  - `last_name` (string) : Nom de famille du client
  - `email` (string) : Email du client
  - `phone_number` (string) : Numéro de téléphone du client
  - `address` (string) : Adresse du client
- **Réponse** : Détails du client créé.

Exemple de réponse :
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

### Route de mise à jour d'un client

- **Description** : Cette route permet de mettre à jour les informations d'un client existant.
- **Endpoint** : `/api/clients/:id`
- **Méthode** : PUT
- **Paramètres** :
  - `first_name` (string) : Prénom du client
  - `last_name` (string) : Nom de famille du client
  - `email` (string) : Email du client
  - `phone_number` (string) : Numéro de téléphone du client
  - `address` (string) : Adresse du client
- **Réponse** : Détails mis à jour du client.

Exemple de réponse :
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

### Route de suppression d'un client

- **Description** : Cette route permet de supprimer un client existant.
- **Endpoint** : `/api/clients/:id`
- **Méthode** : DELETE
- **Réponse** : Confirmation de la suppression.

Exemple de réponse :
```json
{
  "status": "Client deleted"
}
```

### Route de récupération de tous les services

- **Description** : Cette route récupère tous les services enregistrés.
- **Endpoint** : `/api/services`
- **Méthode** : GET
- **Réponse** : Liste des services.

Exemple de réponse :
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

### Route de création d'un service

- **Description** : Cette route permet de créer un nouveau service.
- **Endpoint** : `/api/services`
- **Méthode** : POST
- **Paramètres** :
  - `service_type` (string) : Type de service
  - `start_date` (date) : Date de début du service
  - `end_date` (date) : Date de fin du service
  - `duration` (integer) : Durée du service en minutes
  - `service_provider_id` (integer) : ID du prestataire de services
  - `client_id` (integer) : ID du client
  - `animal_count` (integer) : Nombre d'animaux concernés par le service
- **Réponse** : Détails du service créé.

Exemple de réponse :
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

### Route de mise à jour d'un service

- **Description** : Cette route permet de mettre à jour les informations d'un service existant.
- **Endpoint** : `/api/services/:id`
- **Méthode** : PUT
- **Paramètres** :
  - `service_type` (string) : Type de service
  - `start_date` (date) : Date de début du service
  - `end_date` (date) : Date de fin du service
  - `duration` (integer) : Durée du service en minutes
  - `service_provider_id` (integer) : ID du prestataire de services
  - `client_id` (integer) : ID du client
  - `

animal_count` (integer) : Nombre d'animaux concernés par le service
- **Réponse** : Détails mis à jour du service.

Exemple de réponse :
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

### Route de suppression d'un service

- **Description** : Cette route permet de supprimer un service existant.
- **Endpoint** : `/api/services/:id`
- **Méthode** : DELETE
- **Réponse** : Confirmation de la suppression.

Exemple de réponse :
```json
{
  "status": "Service deleted"
}
```

### Route de récupération de toutes les disponibilités

- **Description** : Cette route récupère toutes les disponibilités des prestataires de services.
- **Endpoint** : `/api/availabilities`
- **Méthode** : GET
- **Réponse** : Liste des disponibilités.

Exemple de réponse :
```json
[
  {
    "id": 1,
    "service_provider_id": 1,
    "service_type": "Garde de chien chez le client",
    "day": "Lundi",
    "start_time": "09:00",
    "end_time": "12:00",
    "max_animals": 2
  },
  {
    "id": 2,
    "service_provider_id": 2,
    "service_type": "Promenade de chien en ville",
    "day": "Mardi",
    "start_time": "14:00",
    "end_time": "17:00",
    "max_animals": 3
  }
]
```

### Route de création d'une disponibilité

- **Description** : Cette route permet de créer une nouvelle disponibilité pour un prestataire de services.
- **Endpoint** : `/api/availabilities`
- **Méthode** : POST
- **Paramètres** :
  - `service_provider_id` (integer) : ID du prestataire de services
  - `service_type` (string) : Type de service
  - `day` (string) : Jour de la semaine
  - `start_time` (time) : Heure de début
  - `end_time` (time) : Heure de fin
  - `max_animals` (integer) : Nombre maximum d'animaux
- **Réponse** : Détails de la disponibilité créée.

Exemple de réponse :
```json
{
  "id": 1,
  "service_provider_id": 1,
  "service_type": "Garde de chien chez le client",
  "day": "Lundi",
  "start_time": "09:00",
  "end_time": "12:00",
  "max_animals": 2
}
```

### Route de mise à jour d'une disponibilité

- **Description** : Cette route permet de mettre à jour les informations d'une disponibilité existante.
- **Endpoint** : `/api/availabilities/:id`
- **Méthode** : PUT
- **Paramètres** :
  - `service_provider_id` (integer) : ID du prestataire de services
  - `service_type` (string) : Type de service
  - `day` (string) : Jour de la semaine
  - `start_time` (time) : Heure de début
  - `end_time` (time) : Heure de fin
  - `max_animals` (integer) : Nombre maximum d'animaux
- **Réponse** : Détails mis à jour de la disponibilité.

Exemple de réponse :
```json
{
  "id": 1,
  "service_provider_id": 1,
  "service_type": "Garde de chien chez le client",
  "day": "Lundi",
  "start_time": "09:00",
  "end_time": "12:00",
  "max_animals": 2
}
```

### Route de suppression d'une disponibilité

- **Description** : Cette route permet de supprimer une disponibilité existante.
- **Endpoint** : `/api/availabilities/:id`
- **Méthode** : DELETE
- **Réponse** : Confirmation de la suppression.

Exemple de réponse :
```json
{
  "status": "Availability deleted"
}
```

