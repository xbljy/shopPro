export default {
  createEvent(state, newEventData) {
    state.events[newEventData._id] = newEventData;
  },
  deleteOneEvent(state, eventId) {
    delete state.events[eventId];
  },
  setEvents(state, events) {
    events.forEach((event) => {
      state.events[event._id] = event;
    });
  },
  setCurrentEvent(state, event) {
    state.currentEvent = event;
  },
  updateOneEvent(state, updatedEvent) {
    state.events[updatedEvent._id] = updatedEvent;
  },
};
