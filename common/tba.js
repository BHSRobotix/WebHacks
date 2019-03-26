(function() {

  const TBA_BASE_URL = 'https://www.thebluealliance.com/api/v3';
  let TBA_AUTH_KEY = '';
  let TBA_AUTH_KEY_VALID = false;

  const messages = {
    NO_KEY: 'You must first set a valid TBA Auth Key via the setAuthKey function',
    INVALID_KEY: 'The key sent for TBA is not valid'
  };

  const tbaFetch = async function(tbaPath) {
    return fetch(`${TBA_BASE_URL}${tbaPath}`, { headers: { 'X-TBA-Auth-Key': TBA_AUTH_KEY } });
  };

  const isAuthKeySet = function() {
    if (TBA_AUTH_KEY !== '' && TBA_AUTH_KEY_VALID) {
      return true;
    }
    console.warn(`TBA: ${messages.NO_KEY}`);
    return false;
  };

  window.tba = {

    setAuthKey: function(tbaAuthKey) {
      TBA_AUTH_KEY = tbaAuthKey;
      return tbaFetch('/status')
        .then(res => {
          if (res.ok) {
            TBA_AUTH_KEY_VALID = true;
          } else {
            console.warn(`TBA: ${messages.INVALID_KEY}`);
          }
        })
        .catch(err => console.warn(`TBA: ${err}`));
    },

    hasValidKey: function() {
      return TBA_AUTH_KEY_VALID;
    },

    fetchTeamsByEvent: async function(eventKey) {
      if (isAuthKeySet()) {
        const res = await tbaFetch(`/event/${eventKey}/teams/simple`);
        let data = await res.json();
        return data;
      }
    },

    fetchTeamResultsByYear: async function(year, teamKey) {
      if (isAuthKeySet()) {
        const res = await tbaFetch(`/team/${teamKey}/events/${year}/statuses`);
        let data = await res.json();
        return data;
      }
    },

    fetchMatchesByTeamAtEvent: async function(teamKey, eventKey) {
      if (isAuthKeySet()) {
        const res = await tbaFetch(`/team/${teamKey}/event/${eventKey}/matches`);
        let data = await res.json();
        return data;
      }
    },

    fetchOprsAtEvent: async function(eventKey) {
      if (isAuthKeySet()) {
        const res = await tbaFetch(`/event/${eventKey}/oprs`);
        let data = await res.json();
        return data;
      }
    }

  };

})();