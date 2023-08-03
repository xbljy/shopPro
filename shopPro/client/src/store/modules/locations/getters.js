export default {
  getAllLocations(state) {
    return state.locations;
  },
  getOneStore(state) {
    return (locationId) => {
      return state.locations[locationId];
    };
  },
  getCurrentLocation(state) {
    return state.currentLocation;
  },
};
