'use strict';
/* Data Access Object (DAO) module for accessing users */

const sqlite = require('sqlite3');
const crypto = require('crypto');

// open the database
const db = new sqlite.Database('db/page.sqlite', (err) => {
  if (err) throw err;
});

exports.getUserById = (id) => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM users WHERE id = ?';
    db.get(sql, [id], (err, row) => {
      if (err)
        reject(err);
      else if (row === undefined)
        resolve({ error: 'User not found.' });
      else {
        // by default, the local strategy looks for "username": not to create confusion in server.js, we can create an object with that property
        const user = { id: row.id, email: row.email, name: row.name, admin:row.admin }
        resolve(user);
      }
    });
  });
};



exports.getUsers = () => {
  
  // controllare se l'utente loggato è l'admin
      return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM users ';
        db.all(sql, [], (err, row) => {
          if (err)
            reject(err);
          else if (row === undefined)
            resolve({ error: 'User not found.' });
          else {
            // by default, the local strategy looks for "username": not to create confusion in server.js, we can create an object with that property
           const users = row.map((e)=> ({id:e.id, name:e.name, email: e.email, admin:e.admin }))
           
            resolve(users);
          }
        });
      });
    
  
  };
  
  exports.getAdmin = () => {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT * FROM users WHERE admin= TRUE ';
      db.get(sql, [], (err, row) => {
        if (err)
          reject(err);
        else if (row === undefined)
          resolve({ error: 'User not found.' });
        else {
       
          const users = { id: row.id, username: row.email, name: row.name, admin:row.admin };
          resolve(users);
        }
      });
    });
  };
  

exports.getUser = (email, password) => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM users WHERE email = ?';
    db.get(sql, [email], (err, row) => {
      if (err) { reject(err); }
      else if (row === undefined) { resolve(false); }
      else {
        const user = { id: row.id, email: row.email, name: row.name, admin: row.admin };

        const salt = row.salt;
        crypto.scrypt(password, salt, 32, (err, hashedPassword) => {
          if (err) reject(err);

          const passwordHex = Buffer.from(row.password, 'hex');

          if (!crypto.timingSafeEqual(passwordHex, hashedPassword))
            resolve(false);
          else resolve(user);
        });
      }
    });
  });
};

