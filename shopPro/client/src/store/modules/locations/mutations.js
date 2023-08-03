export default {
  setLocations(state, locations) {
    state.locations = {};
    console.log(locations);
    locations.forEach((location) => {
      state.locations[location._id] = location;
    });
  },

  addToLocations(state, location) {
    state.locations[location._id] = location;
  },
  deleteAllLocations(state) {
    state.locations = {};
  },
  setCurrentLocation(state, location) {
    state.currentLocation = location;
  },
  deleteOneLocation(state, locationId) {
    delete state.locations[locationId];
  },
  updateLocation(state, updatedLocation) {
    state.locations[updatedLocation._id] = updatedLocation;
  },
};
