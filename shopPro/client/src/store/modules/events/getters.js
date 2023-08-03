export default {
  getAllEvents(state) {
    return state.events;
  },
  getCurrentEvent(state) {
    return state.currentEvent;
  },
  getOneEvent(state) {
    return (eventId) => state.events[eventId];
  },
};
