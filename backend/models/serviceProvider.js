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
