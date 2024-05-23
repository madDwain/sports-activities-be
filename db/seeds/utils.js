const db = require("../../db/connection")

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

exports.checkCategoryExists = (category) => {
  return db.query(`SELECT name FROM categories WHERE name='${category}'`).then(({ rows }) =>{
    if (rows.length === 0) {
      return Promise.reject({ status: 404, msg: "Category not found" })
    } else return true
  })
}

exports.checkEventIDExists = (event_id) => {
  return db.query(`SELECT event_id FROM events WHERE event_id='${event_id}'`).then(({ rows }) =>{
    if (rows.length === 0) {
      return Promise.reject({status:404, msg: 'event_id does not exist'})
    } else return true
  })
}
