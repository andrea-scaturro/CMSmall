import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';


import MainPage from './MainPage';
import API from './API';
import Page from './PagePreview';
import LoginPage from './LoginPage';
import EditForm from './EditPage';
import AddForm from './AddPage';
import ErrorModal from './componets/ErrorModal';


function App() {

  function DefaultRoute() {
    return (
      <Container className='App'>
        <h1>No data here...</h1>
        <h2>This is not the route you are looking for!</h2>
        <Link to='/'>Please go back to main page</Link>
      </Container>
    );
  }



  const [pages, setPages] = useState([]);
  const [user, setUser] = useState(undefined);
  const [users, setUsers] = useState([]);
  const [loggedIn, setLoggedIn] = useState(false);
  const [dirty, setDirty] = useState(true);
  const [title, setTitle] = useState('CMSmall');
  const [image, setImage] = useState([]);
  const [showError,setShowError] = useState(false);
  const [errorMsg,setErrMsg] = useState('');


  function handleError(err) {

    //   console.log('err: ' + JSON.stringify(err));  //  debug
    let errMsg = 'Unkwnown error';
    if (err.errors) {
      if (err.errors[0])
        if (err.errors[0].msg)
          errMsg = err.errors[0].msg;
    } else if (err.error) {
      errMsg = err.error;
    }
    setShowError(true);
    setErrMsg(errMsg);
  };



  useEffect(() => {
    setDirty(false);
    API.getPages()

      .then((f) => { setPages(f); })
      .catch((err) => handleError(err));

  }, [dirty]);




  useEffect(() => {
    setDirty(false);
    API.getTitle()

      .then((f) => { setTitle(f); })
      .catch((err) => handleError(err));


  }, [dirty]);




  useEffect(() => {

    API.getImage()

      .then((f) => { setImage(f); })
      .catch((err) => handleError(err));

  }, []);


  useEffect(() => {

    if (user ? user.admin : false) {
      API.getUsers()
        .then((f) => { setUsers(f); })
        .catch((err) => handleError(err));
    }

  }, [user]);



  useEffect(() => {
    const checkAuth = async () => {
      try {
        // here you have the user info, if already logged in
        const user = await API.getUserInfo();
        setLoggedIn(true);
        setUser(user);
        setDirty(!dirty);

      } catch (err) {
        // NO need to do anything: user is simply not yet authenticated
        //handleError(err);
      }
    };
    checkAuth();
  }, []);

  const doLogOut = async () => {
    await API.logOut();
    setLoggedIn(false);
    setUser(undefined);
    setDirty(!dirty);

  }


  const loginSuccessful = (user) => {

    setUser(user);
    setLoggedIn(true);;
    setDirty(!dirty);

  }

  function addPage(p) {

    const newPage = p;
    setDirty(!dirty);
    API.addPage(newPage)
      .then(() => setDirty(true))
      .catch((err) => handleError(err));

  }

  function deletePage(id) {

    API.deletePage(id)
      .then(() => setDirty(!dirty))
      .catch((err) => handleError(err));

  }

  function editPage(p) {

    if (user.admin) {

      API.editPageByAdmin(p)
        .then(() => setDirty(!dirty))
        .catch((err) => handleError(err));

    }
    else {
      API.editPage(p)
        .then(() => setDirty(!dirty))
        .catch((err) => handleError(err));
    }

  }

  function changeTitle(t) {

    API.changeTitle(t)
      .then((tit) => setTitle(tit))
      .catch((err) => handleError(err));
    setDirty(!dirty);

  }

  function getImage() {

    API.getImage()
      .then((f) => { setImage(f); })
      .catch((err) => handleError(err));
  }

  return (
    <>
    <ErrorModal showError={showError} setShowError={setShowError} errorMsg={errorMsg} ></ErrorModal>

      <BrowserRouter>

        <Routes>

          <Route path="/" element={<MainPage
            pages={pages} user={user} loggedIn={loggedIn} logout={doLogOut} deletePage={deletePage} title={title} changeTitle={changeTitle} />} />

          <Route path='/login' element={<LoginPage loginSuccessful={loginSuccessful} loggedIn={loggedIn} title={title} changeTitle={changeTitle} />} />

          <Route path='/:id' element={<Page pages={pages} title={title} user={user} loggedIn={loggedIn} logout={doLogOut}  > </Page>} />

          <Route path='/pages/edit/:id' element={<EditForm pages={pages} user={user} loggedIn={loggedIn} logout={doLogOut} editPage={editPage} title={title} changeTitle={changeTitle} getImage={getImage} image={image} users={users} />} />

          <Route path='/add-page' element={<AddForm pages={pages} user={user} loggedIn={loggedIn} logout={doLogOut} addPage={addPage} title={title} changeTitle={changeTitle} getImage={getImage} image={image} />} />

          <Route path='/*' element={<DefaultRoute />} />

        </Routes>

      </BrowserRouter>

    </>
  )
}

export default App
