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
