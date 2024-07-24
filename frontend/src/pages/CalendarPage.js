import React, { useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import Modal from 'react-modal';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = momentLocalizer(moment);

const events = [
  {
    title: 'Prestation 1',
    start: new Date(2024, 6, 10, 10, 0), 
    end: new Date(2024, 6, 10, 11, 0),  
    desc: 'Détails sur la prestation 1 bla bla prommenade de chien chienchien chien chien je pense je sais pas',
  },
  {
    title: 'Prestation 2',
    start: new Date(2024, 6, 10, 11, 0),
    end: new Date(2024, 6, 10, 12, 0),   
    desc: 'Détails sur la prestation 2',
  },
  {
    title: 'Prestation 3',
    start: new Date(2024, 6, 11, 14, 0), 
    end: new Date(2024, 6, 15, 15, 0),   
    desc: 'Détails sur la prestation 3',
  },
];

const customStyles = {
  content: {
    zIndex: 1000, 
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
  },
  overlay: {
    zIndex: 1000, 
  },
};

const CalendarPage = () => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [eventDetails, setEventDetails] = useState({});

  const handleSelectEvent = (event) => {
    setEventDetails(event);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  return (
    <div className="max-w-4xl mx-auto bg-white p-8 rounded shadow">
      <h1 className="text-2xl font-bold mb-6">Calendrier des Prestations</h1>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500 }}
        onSelectEvent={handleSelectEvent}
      />
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Détails du Rendez-vous"
        style={customStyles}
      >
        <h2 className="text-xl font-bold mb-4">{eventDetails.title}</h2>
        <p>{eventDetails.desc}</p>
        <p>
          <strong>Début :</strong> {moment(eventDetails.start).format('MMMM Do YYYY, h:mm a')}
        </p>
        <p>
          <strong>Fin :</strong> {moment(eventDetails.end).format('MMMM Do YYYY, h:mm a')}
        </p>
        <button onClick={closeModal} className="mt-4 bg-blue-500 text-white px-4 py-2 rounded">
          Fermer
        </button>
      </Modal>
    </div>
  );
};

export default CalendarPage;
