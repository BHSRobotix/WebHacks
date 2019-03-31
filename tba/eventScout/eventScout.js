(function(_) {

  const nullStats = {
    start: { none: 0, one: 0, two: 0 },
    climb: { none: 0, one: 0, two: 0, three: 0 }
  };

  window.eventScout = {

    summarizeMatches2019: function(matches) {
      let summary = [];
      for (let i = 0; i < matches.length; i++) {
        // only go through all this if the match has data
        if (!!matches[i].score_breakdown) {
          // go through blue and red alliances
          for (let alliance of ['blue', 'red']) {
            // console.log(alliance);
            let tmPos = 0;
            for (let team of matches[i].alliances[alliance].team_keys) {
              // console.log(team);
              let tmSum = summary.find(a => a.team === team);
              if (typeof tmSum === 'undefined') {
                tmSum = {team, start: _.clone(nullStats.start), climb: _.clone(nullStats.climb)};
                summary.push(tmSum);
              }
              // add start position
              const preMatchPos = matches[i].score_breakdown[alliance][`preMatchLevelRobot${++tmPos}`];
              const preMatchLvl = preMatchPos.substr('HabLevel'.length);
              const sandstormAction = matches[i].score_breakdown[alliance][`habLineRobot${tmPos}`];
              if (preMatchPos === 'None' || sandstormAction !== 'CrossedHabLineInSandstorm') {
                tmSum.start.none++;
              } else if (preMatchLvl === '1') {
                tmSum.start.one++;
              } else if (preMatchLvl === '2') {
                tmSum.start.two++;
              } else {
                console.warn(`EVENTSCOUT: Unknown starting location ${preMatchPos} for ${team} in match ${matches[i].key}`);
              }
              // add endgame
              const endMatchPos = matches[i].score_breakdown[alliance][`endgameRobot${tmPos}`];
              const endMatchLvl = endMatchPos.substr('HabLevel'.length);
              if (endMatchPos === 'None') {
                tmSum.climb.none++;
              } else if (endMatchLvl === '1') {
                tmSum.climb.one++;
              } else if (endMatchLvl === '2') {
                tmSum.climb.two++;
              } else if (endMatchLvl === '3') {
                tmSum.climb.three++;
              } else {
                console.warn(`EVENTSCOUT: Unknown climbing location ${endMatchPos} for ${team} in match ${matches[i].key}`);
              }
            }
          }
        }
      }
      return summary;
    }

  }
})(_);