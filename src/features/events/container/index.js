import React, { useState } from 'react';
import EventHeader from '../components/EventHeader';
import EventFilters from '../components/EventFilters';
import EventList from '../components/EventList';
import EventForm from '../components/EventForm';
import EventRegistrations from '../components/EventRegistrations';
import { useEvents } from '../hooks/useEvents';

const EventsContainer = () => {
  const [view, setView] = useState('list'); // 'list', 'form', or 'registrations'
  const [currentEvent, setCurrentEvent] = useState(null);
  const [registrations, setRegistrations] = useState(null);

  const {
    events,
    loading,
    error,
    meta,
    page,
    setPage,
    search,
    setSearch,
    type,
    setType,
    date,
    setDate,
    loadEvents,
    resetFilters,
    updateFilters,
    getEventById,
    createEvent,
    updateEvent,
    deleteEvent,
    updateEventRegistration,
    deleteEventRegistration,
    createEventRegistration,
    getClubMemberById,
    searchClubMembers
  } = useEvents();

  // Update filters
  const updateFilterParams = (newFilters) => {
    if (newFilters.type !== undefined && type !== newFilters.type) {
      setType(newFilters.type);
      setPage(1);
    }
    if (newFilters.search !== undefined && search !== newFilters.search) {
      setSearch(newFilters.search);
      setPage(1);
    }
    if (newFilters.date !== undefined && date !== newFilters.date) {
      setDate(newFilters.date);
      setPage(1);
    }
  };

  const handleDateChange = (newDate) => {
    // Only reset to page 1 if the date is actually different from the current date
    if (date !== newDate) {
      setDate(newDate);
      setPage(1);
    }
  };

  // Handle adding a new event
  const handleAddEvent = () => {
    setCurrentEvent(null);
    setView('form');
  };

  // Handle editing an event
  const handleEditEvent = async (event) => {
    try {
      // Load the full event data
      const fullEvent = await getEventById(event.id);
      if (fullEvent) {
        setCurrentEvent(fullEvent);
        setView('form');
      }
    } catch (err) {
      // Error is handled in the getEventById function
    }
  };

  // Handle viewing registrations
  const handleViewRegistrations = async (event) => {
    try {
      // Load the full event data including registrations
      const fullEvent = await getEventById(event.id);
      if (fullEvent) {
        setCurrentEvent(fullEvent);
        setRegistrations(fullEvent.eventRegistrations);
        setView('registrations');
      }
    } catch (err) {
      // Error is handled in the getEventById function
    }
  };

  // Handle saving an event (create or update)
  const handleSaveEvent = async (eventData) => {
    try {
      if (currentEvent) {
        // Update existing event
        await updateEvent(currentEvent.id, eventData);
      } else {
        // Create new event
        await createEvent(eventData);
      }
      setView('list');
      // Reload events to ensure latest data is shown
      loadEvents();
    } catch (err) {
      // Error is handled in the create/update functions
    }
  };

  // Handle canceling form
  const handleCancelForm = () => {
    setView('list');
    setCurrentEvent(null);
    // Reload events to ensure latest data is shown
    loadEvents();
  };

  // Handle going back from registrations view
  const handleBackFromRegistrations = () => {
    setView('list');
    setCurrentEvent(null);
    setRegistrations(null);
    // Reload events to ensure latest data is shown
    loadEvents();
  };

  // Handle deleting an event
  const handleDeleteEvent = async (id) => {
    try {
      await deleteEvent(id);
      // If the list is empty and we're not on page 1, go back a page
      if (events.length === 1 && page > 1) {
        setPage(page - 1);
      } else {
        loadEvents();
      }
    } catch (err) {
      // Error is handled in the deleteEvent function
    }
  };

  // Reset filters to defaults when returning to list
  const resetFiltersToDefaults = () => {
    setSearch('');
    setType('TODAS');
    const now = new Date();
    setDate(now.toISOString().slice(0, 7)); // Default to current year-month
  };


  // Form view
  if (view === 'form') {
    return (
      <EventForm
        event={currentEvent}
        onSave={handleSaveEvent}
        onCancel={handleCancelForm}
      />
    );
  }

  // Registrations view
  if (view === 'registrations') {
    return (
      <EventRegistrations
        event={currentEvent}
        registrations={registrations}
        onBack={handleBackFromRegistrations}
        onUpdateRegistration={updateEventRegistration}
        onDeleteRegistration={deleteEventRegistration}
        createEventRegistration={createEventRegistration}
        getClubMemberById={getClubMemberById}
        searchClubMembers={searchClubMembers}
        onRefreshEvent={async (eventId) => {
          const fullEvent = await getEventById(eventId);
          if (fullEvent) {
            setCurrentEvent(fullEvent);
            setRegistrations(fullEvent.eventRegistrations);
          }
        }}
      />
    );
  }

  // List view
  return (
    <div>
      <EventHeader onAddEvent={handleAddEvent} />

      <EventFilters
        filters={{ type, search, date }}
        onFilterChange={updateFilterParams}
        onDateChange={handleDateChange}
      />

      <EventList
        events={events}
        loading={loading}
        meta={meta}
        page={page}
        setPage={setPage}
        onEdit={handleEditEvent}
        onDelete={handleDeleteEvent}
        onViewRegistrations={handleViewRegistrations}
        onAddEvent={handleAddEvent}
      />
    </div>
  );
};

export default EventsContainer;