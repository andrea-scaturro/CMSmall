'use strict';

const sqlite = require('sqlite3');
const dayjs = require('dayjs');


// open the database
const db = new sqlite.Database('db/page.sqlite', (err) => {
  if (err) throw err;
});

// get all pages 

exports.listPages = () => {
  return new Promise((resolve, reject) => {

    const sql = 'SELECT pages.id, pages.title, pages.authorId, pages.creationDate, pages.publishDate, users.name FROM pages, users WHERE pages.authorId = users.id';
    db.all(sql, [], (err, rows) => {
      if (err) {

        reject(err);

        return;
      }
      const sql2 = 'SELECT * FROM blocks';
      db.all(sql2, [], (err, rows_block) => {
        if (err) {

          reject(err);

          return;
        }

        const pages = rows.map((e) => ({ id: e.id, title: e.title, authorId: e.authorId, userName: e.name, creationDate: e.creationDate, publishDate: e.publishDate, blocks: [] }));

        const blocchi = rows_block.map((e) => ({ id: e.id, pageId: e.pageId, type: e.type, orderIndex: e.orderIndex, content: e.content, imagePath: e.imagePath }));

        pages.forEach(e => {

          blocchi.forEach(element => {
            if (element.pageId === e.id) {
              e.blocks.push(element);
            }
          });
        });


        resolve(pages);
      });
    });
  })
};


// get the page identified by {id}
exports.getPage = (id) => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM pages JOIN users ON pages.authorId = users.id WHERE pages.id = ?';
    db.get(sql, [id], (err, row) => {
      if (err) {
        reject(err);
        return;
      }
      if (row == undefined) {
        resolve({ error: 'Question not found.' });
      } else {
        const page = { id: row.id, title: title.text, authorId: row.authorId, createDate: dayjs(row.createDate), publishDate: dayjs(row.publishDate) };
        resolve(page);
      }
    });
  });
};

// update page user
exports.updatePage = (page, id) => {

  return new Promise((resolve, reject) => {
    const sql = 'UPDATE pages SET title=?, authorId=?, publishDate=? WHERE id=? AND authorId=?';
    db.run(sql, [page.title, page.authorId, page.publishDate, page.id, id], function (err) {
      if (err) {
        reject(err);
        return;
      }
      deleteContentBlocks();
    });

    function deleteContentBlocks() {
      const sql2 = 'DELETE FROM blocks WHERE pageId = ? ';
      db.run(sql2, [page.id], function (err) {
        if (err) {
          reject(err);
          return;
        }
        insertContentBlocks();
      });
    }

    function insertContentBlocks() {
      const insertPromises = [];
      page.blocks.forEach(element => {
        const sql2 = 'INSERT INTO blocks(id, pageId, type, orderIndex, content, imagePath) VALUES(?, ?, ?, ?, ?, ?)';
        const insertPromise = new Promise((resolve, reject) => {
          db.run(sql2, [null, page.id, element.type, element.orderIndex, element.content, element.imagePath], function (err) {
            if (err) {
              reject(err);
              return;
            }
            resolve(this.lastID);
          });
        });
        insertPromises.push(insertPromise);
      });

      Promise.all(insertPromises)
        .then(() => {
          resolve();
        })
        .catch(err => {
          reject(err);
        });
    }
  });
};



// update page admin
exports.updatePageByAdmin = (page) => {
  
  return new Promise((resolve, reject) => {
    const sql = 'UPDATE pages SET title=?, authorId=?, publishDate=? WHERE id=?';
    db.run(sql, [page.title, page.authorId, page.publishDate, page.id], function (err) {
      if (err) {
        reject(err);
        return;
      }
      deleteContentBlocks();
    });

    function deleteContentBlocks() {
      const sql2 = 'DELETE FROM blocks WHERE pageId = ?';
      db.run(sql2, [page.id], function (err) {
        if (err) {
          reject(err);
          return;
        }
        insertContentBlocks();
      });
    }

    function insertContentBlocks() {
      const insertPromises = [];
      page.blocks.forEach(element => {
        const sql2 = 'INSERT INTO blocks(id, pageId, type, orderIndex, content, imagePath) VALUES(?, ?, ?, ?, ?, ?)';
        const insertPromise = new Promise((resolve, reject) => {
          db.run(sql2, [null, page.id, element.type, element.orderIndex, element.content, element.imagePath], function (err) {
            if (err) {
              reject(err);
              return;
            }
            resolve(this.lastID);
          });
        });
        insertPromises.push(insertPromise);
      });

      Promise.all(insertPromises)
        .then(() => {
          resolve();
        })
        .catch(err => {
          reject(err);
        });
    }
  });
};



exports.getTitle = () => {

  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM title ';

    db.all(sql, [], (err, rows) => {
      if (err) {

        reject(err);
        return;
      }

      const title = rows;

      resolve(title);
    });
  });
};



exports.getImage = () => {

  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM image ';

    db.all(sql, [], (err, rows) => {
      if (err) {

        reject(err);
        return;
      }

      const image = rows;

      resolve(image);
    });
  });
};



exports.updateTitle = (title) => {

  return new Promise((resolve, reject) => {

    const sql = 'UPDATE title  SET title=?   ';
    db.run(sql, [title.title], function (err) {
      if (err) {
        reject(err);
        return;
      }
      resolve(title);
    });




  });
};


// add a new page
exports.createPage = (page) => {
  return new Promise((resolve, reject) => {

    const sql = 'INSERT INTO pages(id, title, authorId,creationDate, publishDate) VALUES(?, ?, ?,?, ?)';
    db.run(sql, [page.id, page.title, page.authorId, page.creationDate, page.publishDate], function (err) {
      if (err) {
        reject(err);
        return;
      }
      resolve(this.lastID);
    });

  });


};




// add a blocks in a new page
exports.addBlocks = (page, id) => {
  return new Promise((resolve, reject) => {
    page.blocks.forEach(element => {
      const sql2 = 'INSERT INTO blocks(id, pageId, type,orderIndex, content, imagePath) VALUES(?, ?, ?,?, ?,?)';
      db.run(sql2, [null, id, element.type, element.orderIndex, element.content, element.imagePath], function (err) {
        if (err) {
          reject(err);
          return;
        }

        resolve(this.lastID);
      });
    });

  });


};




// delete an existing page
exports.deletePage = (id, user) => {
  return new Promise((resolve, reject) => {

    if (user.admin) {
      const sql = 'DELETE FROM pages WHERE id = ? ';
      db.run(sql, [id], function (err) {
        if (err) {
          reject(err);
          return;
        } else
          resolve(this.changes);  // return the number of affected rows
      });
    } else {
      const sql = 'DELETE FROM pages WHERE id = ? AND authorId = ?';
      db.run(sql, [id,user.id], function (err) {
        if (err) {
          reject(err);
          return;
        } else
          resolve(this.changes);  // return the number of affected rows
      });
    }

    const sql2 = 'DELETE  FROM blocks WHERE pageId = ? ';
    db.run(sql2, [id], function (err) {
      if (err) {
        reject(err);
        return;
      } else
        resolve(this.changes);  // return the number of affected rows
    });
  });
}

