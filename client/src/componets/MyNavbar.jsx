
import { Container, Button, Navbar, OverlayTrigger, Tooltip, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';


function MyNavbar(props) {

  const navigate = useNavigate();

  const [title, setTitle] = useState(props.title);
  const [setting, setSetting] = useState(true);


  function handleClick() {
    if (props.loggedIn) {
     
      props.logout();
      if(props.backoffice){
        props.setBackOffice(false);
      }
      navigate('/');
      
   
    }
    else {
      navigate('/login');
    }

  }

  function handleSetting(e) {
    e.preventDefault();
    props.changeTitle(title);
    setSetting(!setting);

  }

 function handleBackOffice(){
    props.setBackOffice(!props.backoffice);
  }

  return (
    //background:"#1c3449"
    <>
      <Navbar bg="dark" variant="dark" style={{height:" 100px "}}  >
        <Container fluid>

          <Navbar.Brand style={{ fontSize: "40px" }}>
            <Container fluid style={{ background: "#212529" , marginLeft:"100px"}} >

              <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" fill="currentColor" className="bi bi-front" viewBox="0 0 16 16">
                <path d="M0 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v2h2a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-2H2a2 2 0 0 1-2-2V2zm5 10v2a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V6a1 1 0 0 0-1-1h-2v5a2 2 0 0 1-2 2H5z" />
              </svg>
              <input style={{ marginLeft:"15px",fontFamily: "Verdana", borderRadius: "30px", background: "#212529", color: " white", borderColor: "white" }} disabled={setting} value={title} onChange={(e) => setTitle(e.target.value)}  >
              </input>



              {!setting && <Button onClick={handleSetting} style={{ background: "#212529", color: " white", borderColor: "#212529" }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" className="bi bi-check-circle" viewBox="0 0 16 16">
                  <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                  <path d="M10.97 4.97a.235.235 0 0 0-.02.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05z" />
                </svg>
              </Button>}
            </Container>
          </Navbar.Brand>


          { props.flag && (props.loggedIn && !props.backoffice )&&  <Button style={{ background:"#212529" , borderColor:"#212529"}} onClick={handleBackOffice}>
                Back Office
            </Button>}
            { props.backoffice &&  <Button style={{ background:"#212529" , borderColor:"#212529"}} onClick={handleBackOffice}>
                Front Office
            </Button>}

          {props.loggedIn ? <Container fluid style={{ fontFamily: "Comic Sans MS", borderRadius: '50px', background: "white", width: "300px", marginRight: "100px", height: "50px" }}>
            { (props.user ? ( props.user.admin ? props.user.name + '    (admin)' : props.user.name  )  : '')}
          
            <Button onClick={handleClick} variant="dark" style={{ fontFamily: "Verdana", borderRadius: "60px", marginLeft: "18px", marginTop:"5px" }}  >  Logout</Button>

            {(props.user ? props.user.admin : false) ?
              <OverlayTrigger style={{ fontSize: "5000px" }}
                placement='bottom'
                overlay={
                  <Tooltip >
                    Press for update title !!
                  </Tooltip>
                }
              >
                <Button onClick={() => setSetting(!setting)} style={{ borderRadius: "60px", marginRight: "10px", marginLeft: "5px", marginTop: "5px" }} variant="dark"> <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-gear-fill" viewBox="0 0 16 16">
                  <path d="M9.405 1.05c-.413-1.4-2.397-1.4-2.81 0l-.1.34a1.464 1.464 0 0 1-2.105.872l-.31-.17c-1.283-.698-2.686.705-1.987 1.987l.169.311c.446.82.023 1.841-.872 2.105l-.34.1c-1.4.413-1.4 2.397 0 2.81l.34.1a1.464 1.464 0 0 1 .872 2.105l-.17.31c-.698 1.283.705 2.686 1.987 1.987l.311-.169a1.464 1.464 0 0 1 2.105.872l.1.34c.413 1.4 2.397 1.4 2.81 0l.1-.34a1.464 1.464 0 0 1 2.105-.872l.31.17c1.283.698 2.686-.705 1.987-1.987l-.169-.311a1.464 1.464 0 0 1 .872-2.105l.34-.1c1.4-.413 1.4-2.397 0-2.81l-.34-.1a1.464 1.464 0 0 1-.872-2.105l.17-.31c.698-1.283-.705-2.686-1.987-1.987l-.311.169a1.464 1.464 0 0 1-2.105-.872l-.1-.34zM8 10.93a2.929 2.929 0 1 1 0-5.86 2.929 2.929 0 0 1 0 5.858z" />
                </svg></Button>

              </OverlayTrigger>
              : ''}
               
          </Container> :
            <Button style={{marginRight:"120px", fontSize:"20px" }} onClick={handleClick} variant="dark"> Login</Button>

          }


        </Container>
      </Navbar>
    </>
  );
}

export default MyNavbar;