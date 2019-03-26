(function() {

  window.preScout = {

    getEvents: function(d) {
      let retArr = [];
      for (k of Object.getOwnPropertyNames(d)) {
        if (k.indexOf('week0') <= 0 && !!d[k] && !!d[k].overall_status_str) {
          retArr.push({
            eventKey: k,
            eventResult: d[k].overall_status_str
          });
        }
      }
      return retArr;
    },

    summarizeMatches2019: function(tmKey, matches) {
      let summary = {
        start: { none: 0, one: 0, two: 0 },
        climb: { none: 0, one: 0, two: 0, three: 0 }
      };
      for (let i = 0; i < matches.length; i++) {
        // figure out which alliance they were on and which driver station they had
        let alliance = '';
        let driverStation = -1;
        if (matches[i].alliances.blue.team_keys.indexOf(tmKey) >= 0) {
          alliance = 'blue';
          driverStation = matches[i].alliances.blue.team_keys.indexOf(tmKey) + 1;
        } else if (matches[i].alliances.red.team_keys.indexOf(tmKey) >= 0) {
          alliance = 'red';
          driverStation = matches[i].alliances.red.team_keys.indexOf(tmKey) + 1;
        } else {
          console.warn(`PRESCOUT: Didnt find an alliance for ${tmKey} in match: ${matches[i]}`);
        }
        // now pull that scoring data for that alliance
        const scoreData = matches[i].score_breakdown[alliance];
        const preMatchPos = scoreData[`preMatchLevelRobot${driverStation}`];
        const preMatchLvl = preMatchPos.substr('HabLevel'.length);
        const endMatchPos = scoreData[`endgameRobot${driverStation}`];
        const endMatchLvl = endMatchPos.substr('HabLevel'.length);
        if (preMatchPos === 'None') {
          summary.start.none++;
        } else if (preMatchLvl === '1') {
          summary.start.one++;
        } else if (preMatchLvl === '2') {
          summary.start.two++;
        } else {
          console.warn(`PRESCOUT: Unknown starting location ${preMatchPos} for ${tmKey} in match ${matches[i].key}`);
        }
        if (endMatchPos === 'None') {
          summary.climb.none++;
        } else if (endMatchLvl === '1') {
          summary.climb.one++;
        } else if (endMatchLvl === '2') {
          summary.climb.two++;
        } else if (endMatchLvl === '3') {
          summary.climb.three++;
        } else {
          console.warn(`PRESCOUT: Unknown climbing location ${endMatchPos} for ${tmKey} in match ${matches[i].key}`);
        }
      }
      return summary;
    }

  }
})();