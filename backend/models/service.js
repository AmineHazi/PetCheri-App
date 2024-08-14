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
      type: DataTypes.INTEGER, // Duration in minutes
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
