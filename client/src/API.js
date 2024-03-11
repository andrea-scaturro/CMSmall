import dayjs from "dayjs";

const URL = 'http://localhost:3005/api';




async function getPages() {

  const response = await fetch(URL + '/pages');
  const pages = await response.json();

  if (response.ok) {

    return pages.map((e) => ({ id: e.id, title: e.title, authorId: e.authorId,userName: e.userName  ,creationDate: e.creationDate, publishDate: e.publishDate, blocks: e.blocks }));

  } else {
    throw pages;
  }
}



async function getTitle() {

  const response = await fetch(URL + '/title');
  const title = await response.json();
  
  if (response.ok) {

    return title[0].title

  } else {
    throw title;
  }
}


async function getImage() {

  let response = await fetch(URL + '/image', {
    method: 'GET',
    
  });
  const image = await response.json();
  
  if (response.ok) {

    return image

  } else {
    throw image;
  }
}



async function getUsers() {

 
 const response = await fetch(URL + '/users', {credentials:'include'});
  const users = await response.json();
  
  if (response.ok) {

    return users

  } else {
    throw users;
  }
}


async function getBlocks() {

  const response = await fetch(URL + '/blocks');
  const blocks = await response.json();

  if (response.ok) {
    return blocks.map((e) => ({ id: e.id, pageId: e.pageId, type: e.type, orderIndex: e.orderIndex, content: e.content, imagePath: e.imagePath }));

  } else {
    throw blocks;
  }
}



async function logIn(credentials) {
  let response = await fetch(URL + '/sessions', {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  });
  if (response.ok) {
    const user = await response.json();
    return user;
  } else {
    const errDetail = await response.json();
    throw errDetail.message;
  }
}

async function logOut() {
  await fetch(URL + '/sessions/current', {
    method: 'DELETE',
    credentials: 'include'
  });
}


async function getUserInfo() {
  const response = await fetch(URL + '/sessions/current', {
    credentials: 'include'
  });
  const userInfo = await response.json();
  if (response.ok) {
    return userInfo;
  } else {
    throw userInfo;
  }
}


function addPage(page) {
  
  return new Promise((resolve, reject) => {
    fetch(URL + `/page`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        "id": page.id,
        "title": page.title,
        "authorId": page.authorId,
        "creationDate": page.creationDate.format("YYYY-MM-DD"),
        "publishDate":page.publishDate ? page.publishDate.format("YYYY-MM-DD") : null,
        "blocks": page.blocks
      }),
    }).then((response) => {
      if (response.ok) {
        response.json()
          .then((id) => resolve(id))
          .catch(() => { reject({ error: "Cannot parse server response." }) });
      } else {
        
        response.json()
          .then((message) => { reject(message); }) // error message in the response body
          .catch(() => { reject({ error: "Cannot parse server response." }) }); 
      }
    }).catch(() => { reject({ error: "Cannot communicate with the server." }) }); // connection errors
  });
}


function deletePage(id) {
  
  return new Promise((resolve, reject) => {
    fetch(URL + `/pages/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    }).then((response) => {
      if (response.ok) {
        resolve(null);
      } else {
        // analyze the cause of error
        response.json()
          .then((message) => { reject(message); }) // error message in the response body
          .catch(() => { reject({ error: "Cannot parse server response." }) }); // something else
      }
    }).catch(() => { reject({ error: "Cannot communicate with the server." }) }); // connection errors
  });
}





async function editPage(page) {

  fetch(URL + '/edit-page/' + page.id, {
    method: 'PUT',
    credentials:"include",
    body: JSON.stringify({
      "id": page.id,
      "title": page.title,
      "authorId": page.authorId,
      "creationDate": page.creationDate,
      "publishDate":page.publishDate ? dayjs(page.publishDate).format("YYYY-MM-DD") : null,
      "blocks": page.blocks
    }),
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
    },
  })
    .then((response) => response.json())
    .then((data) => {
      //
      
      console.log(data);
      // Handle data
    })
    .catch((err) => {
      console.log(err.message);
    });

}


async function editPageByAdmin(page) {


  fetch(URL + '/admin/edit-page/' + page.id, {
    method: 'PUT',
    credentials:"include",
    body: JSON.stringify({
      "id": page.id,
      "title": page.title,
      "authorId": page.authorId,
      "creationDate": page.creationDate,
      "publishDate":page.publishDate ?  dayjs(page.publishDate).format("YYYY-MM-DD") : null,
      "blocks": page.blocks
    }),
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
    },
  })
    .then((response) => response.json())
    .then((data) => {
      //console.log(data);
      // Handle data
    })
    .catch((err) => {
      console.log(err.message);
    });

}



async function changeTitle(title) {

  fetch(URL + '/edit-title/', {
    method: 'PUT',
    credentials:"include",
    body: JSON.stringify({title}),
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
    },
  })
    .then((response) => response.json())
    .then((data) => {
      //console.log(data);
      // Handle data
    })
    .catch((err) => {
      console.log(err.message);
    });
}



const API = { getPages, getBlocks, logIn, logOut, getUserInfo, addPage, deletePage, editPage, getTitle, changeTitle, getImage,getUsers,editPageByAdmin };
export default API;