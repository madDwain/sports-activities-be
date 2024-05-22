exports.convertTimestampToDate = ({ created_at, ...otherProperties }) => {
  if (!created_at) return { ...otherProperties };
  return { created_at: new Date(created_at), ...otherProperties };
};

exports.createRef = (arr, key) => {
  return arr.reduce((ref, element) => {
    ref[element[key]] = element[key];
    return ref;
  }, {});
};

exports.formatEvents = (users, idLookup) => {
  return users.map(({ created_by, username, ...restOfEvent }) => {
    const host = idLookup[username];
    return {
      host,
      ...restOfEvent
    };
  });
};

