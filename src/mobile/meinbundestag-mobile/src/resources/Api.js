const URL = 'http://localhost:3000';


const api = {

  deputies: async function getDeputies() {
    const route = `${URL}/deputies`;
    return fetch(route)
      .then((response) => response.json())
      .then((names) => names);
  },

  profile: async function getProfile(name) {
    const urlName = name.replace(/ /g, '-').toLowerCase();
    const route = `${URL}/profile/${urlName}`;
    return fetch(route)
      .then((response) => response.json())
      .then((profile) => profile);
  },

};


export default api;
