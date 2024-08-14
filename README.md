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

#### Routes
Les routes définissent les points d'entrée de l'API pour interagir avec les différentes entités de l'application (e.g., Admins, Service Providers, Clients, Services, Applications).

**Route d'inscription des applications**
- **Description** : Cette route gère la soumission des demandes d'inscription des prestataires de services. Un jeton unique est généré pour chaque demande et un email d'invitation est envoyé au candidat.
- **Endpoint** : `/api/applications`
- **Méthode** : POST
- **Paramètres** : Informations du candidat (e.g., email, prénom, nom, numéro de téléphone, adresse, description du profil)
- **Réponse** : Les détails de la demande créée et l'envoi de l'email d'invitation.

**Route de récupération des applications par jeton**
- **Description** : Cette route récupère les informations d'une demande d'inscription à partir du jeton unique fourni.
- **Endpoint** : `/api/applications/:token`
- **Méthode** : GET
- **Paramètres** : Jeton unique de la demande
- **Réponse** : Les détails de la demande.

**Route de finalisation de l'inscription**
- **Description** : Cette route permet aux candidats de compléter leur inscription en fournissant un mot de passe et en acceptant les CGV et le contrat.
- **Endpoint** : `/api/complete-registration/:token`
- **Méthode** : POST
- **Paramètres** : Mot de passe, acceptation des CGV, signature du contrat
- **Réponse** : Création de l'utilisateur, mise à jour de l'état de la demande et génération d'un jeton JWT.

**Route de connexion**
- **Description** : Cette route gère l'authentification des utilisateurs en vérifiant leur email et mot de passe.
- **Endpoint** : `/api/login`
- **Méthode** : POST
- **Paramètres** : Email, mot de passe
- **Réponse** : Jeton JWT si authentification réussie.

**Route de récupération du profil utilisateur**
- **Description** : Cette route permet de récupérer les informations du profil de l'utilisateur authentifié.
- **Endpoint** : `/api/profile`
- **Méthode** : GET
- **Paramètres** : Jeton JWT dans l'en-tête Authorization
- **Réponse** : Informations du profil utilisateur.

**Route de mise à jour du profil utilisateur**
- **Description** : Cette route permet de mettre à jour les informations du profil de l'utilisateur authentifié.
- **Endpoint** : `/api/profile`
- **Méthode** : PUT
- **Paramètres** : Informations à mettre à jour (e.g., prénom, nom, email, numéro de téléphone, adresse, description du profil, photo de profil)
- **Réponse** : Les détails mis à jour du profil utilisateur.

**Route d'envoi de messages à Slack**
- **Description** : Cette route envoie un message à un canal Slack spécifié.
- **Endpoint** : `/send-to-slack`
- **Méthode** : POST
- **Paramètres** : Message à envoyer
- **Réponse** : Confirmation de l'envoi du message.

**Route de récupération de toutes les demandes d'inscription**
- **Description** : Cette route récupère toutes les demandes d'inscription.
- **Endpoint** : `/api/applications`
- **Méthode** : GET
- **Réponse** : Liste des demandes d'inscription.

**Route de récupération de tous les prestataires de services**
- **Description** : Cette route récupère tous les prestataires de services enregistrés.
- **Endpoint** : `/api/service-providers`
- **Méthode** : GET
- **Réponse** : Liste des prestataires de services.

**Route de création d'un prestataire de services**
- **Description** : Cette route permet de créer un nouveau prestataire de services.
- **Endpoint** : `/api/service-providers`
- **Méthode** : POST
- **Paramètres** : Informations du prestataire de services (e.g., prénom, nom, email, numéro de téléphone, adresse, description du profil, photo de profil, services offerts, disponibilités)
- **Réponse** : Détails du prestataire de services créé.

**Route de mise à jour d'un prestataire de services**
- **Description** : Cette route permet de mettre à jour les informations d'un prestataire de services existant.
- **Endpoint** : `/api/service-providers/:id`
- **Méthode** : PUT
- **Paramètres** : Informations à mettre à jour du prestataire de services
- **Réponse** : Détails mis à jour du prestataire de services.

**Route de suppression d'un prestataire de services**
- **Description** : Cette route permet de supprimer un prestataire de services existant.
- **Endpoint** : `/api/service-providers/:id`
- **Méthode** : DELETE
- **Réponse** : Confirmation de la suppression.

**Route de récupération de tous les clients**
- **Description** : Cette route récupère tous les clients enregistrés.
- **Endpoint** : `/api/clients`
- **Méthode** : GET
- **Réponse** : Liste des clients.

**Route de création d'un client**
- **Description** : Cette route permet de créer un nouveau client.
- **Endpoint** : `/api/clients`
- **Méthode** : POST
- **Paramètres** : Informations du client (e.g., prénom, nom, email, numéro de téléphone, adresse)
- **Réponse** : Détails du client créé.

**Route de mise à jour d'un client**
- **Description** : Cette route permet de mettre à jour les informations d'un client existant.
- **Endpoint** : `/api/clients/:id`
- **Méthode** : PUT
- **Paramètres** : Informations à mettre à jour du client
- **Réponse** : Détails mis à jour du client.

**Route de suppression d'un client**
- **Description** : Cette route permet de supprimer un client existant.
- **Endpoint** : `/api/clients/:id`
- **Méthode** : DELETE
- **Réponse** : Confirmation de la suppression.

**Route de récupération de tous les services**
- **Description** : Cette route récupère tous les services enregistrés.
- **Endpoint** : `/api/services`
- **Méthode** : GET
- **Réponse** : Liste des services.

**Route de création d'un service**
- **Description** : Cette route permet de créer un nouveau service.
- **Endpoint** : `/api/services`
- **Méthode** : POST
- **Paramètres** : Informations du service (e.g., type de service, date de début, date de fin, durée, ID du prestataire de services, ID du client, nombre d'animaux)
- **Réponse** : Détails du service créé.

**Route de mise à jour d'un service**
- **Description** : Cette route permet de mettre à jour les informations d'un service existant.
- **Endpoint** : `/api/services/:id`
- **Méthode** : PUT
- **Paramètres** : Informations à mettre à jour du service
- **Réponse** : Détails mis à jour du service.

**Route de suppression d'un service**
- **Description** : Cette route permet de supprimer un service existant.
- **Endpoint** : `/api/services/:id`
- **Méthode** : DELETE
- **Réponse** : Confirmation de la suppression.

**Route de récupération de toutes les disponibilités**
- **Description** : Cette route récupère toutes les disponibilités des prestataires de services.
- **Endpoint** : `/api/availabilities`
- **Méthode** : GET
- **Réponse** : Liste des disponibilités.

**Route de création d'une disponibilité**
- **Description** : Cette route permet de créer une nouvelle disponibilité pour un prestataire de services.
- **Endpoint** : `/api/availabilities`
- **Méthode** : POST
- **Paramètres** : Informations de la disponibilité (e.g., ID du prestataire de services, type de service, jour, heure de début, heure de fin, nombre maximum d'animaux)
- **Réponse** : Détails de la disponibilité créée.

**Route de mise à jour d'une disponibilité**
- **Description** : Cette route permet de mettre à jour les informations d'une disponibilité existante.
- **Endpoint** : `/api/availabilities/:id`
- **Méthode** : PUT
- **Paramètres** : Informations à mettre à jour de la disponibilité
- **Réponse** : Détails mis à jour de la disponibilité.

**Route de suppression d'une disponibilité**
- **Description** : Cette route permet de supprimer une disponibilité existante.
- **Endpoint** : `/api/availabilities/:id`
- **Méthode** : DELETE
- **Réponse** : Confirmation de la suppression.

Cette documentation fournit une vue d'ensemble des routes principales et de leur fonctionnalité. Chaque route permet de gérer une partie spécifique de l'application, facilitant ainsi la gestion des utilisateurs, des prestataires de services, des clients, des services et des disponibilités.

