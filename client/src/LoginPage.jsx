import MyNavbar from './componets/MyNavbar';
import { Container, Alert } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { Input } from '@nextui-org/react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import API from './API';


function LoginPage(props) {

    const [username, setUsername] = useState('picone@test.com');
    const [password, setPassword] = useState('pwd');

    const [showAlert, setShowAlert] = useState(false);
    const [errorMsg, setErrorMsg] = useState();
    const navigate = useNavigate();

    const doLogIn = (credentials) => {
        API.logIn(credentials)
            .then(user => {

                props.loginSuccessful(user);
                navigate('/');
            })
            .catch(err => {
                // NB: Generic error message, should not give additional info (e.g., if user exists etc.)
               
                setErrorMsg("Incorrect username or passwod");
                setShowAlert(true);
            })
    }

    function handleClick(e) {

        e.preventDefault();

        const credentials = { username, password };

        // SOME VALIDATION, ADD MORE if needed (e.g., check if it is an email if an email is required, etc.)
        let valid = true;
        if (username === '' || password === '')
            valid = false;

        if (valid) {
            doLogIn(credentials);
          
        } else {
            
            setErrorMsg("Missing value in the input");
            setShowAlert(true);
        }
    }

    function goBack() {
        navigate('/');
    }

    return (
        <>

            <MyNavbar  title={props.title} changeTitle={props.changeTitle} logout={props.logout} loggedIn={props.loggedIn} ></MyNavbar>
            {showAlert && <Alert variant='danger' onClose={() => setShowAlert(false)} dismissible>{errorMsg} </Alert>}
            <Container style={{ borderRadius: '20px', boxShadow: "2px 2px 10px rgba(0,0,0,0.3)", marginTop: "100px", width: "600px", height: "600px" }}>
                <Container style={{ display: "flex", justifyContent: "center", alignItems: "center", marginTop: "50px" }}>
                    <h1 style={{fontFamily:"Verdana", fontSize: "80px", marginTop: "60px", marginBottom:"50px" }}>Login</h1>
                </Container>
                <Container style={{ display: "flex", justifyContent: "center", alignItems: "center", marginTop: "20px", marginBottom: "100px" }}>
                    <Form>

                        <Container style={{ marginTop: "50px" }}>
                            <Input
                                onChange={ev => setUsername(ev.target.value)}
                                value={username}
                                underlined
                                clearable
                                type="email"
                                width='200px'
                                labelPlaceholder="E-mail"
                                color="default" />
                        </Container>

                        <Container style={{ marginTop: "50px" }}>
                            <Input.Password
                                value={password}
                                onChange={ev => setPassword(ev.target.value)}
                                underlined
                                clearable
                                color="default"
                                type="password"
                                labelPlaceholder="Password"
                            />
                        </Container>

                        <Container style={{ display: "flex", justifyContent: "center", alignItems: "center", marginTop: "50px" }}>
                            <Button variant="dark" type="submit" onClick={(e) => handleClick(e)} style={{ fontSize: "20px" }}> Login </Button>

                        </Container>
                        <Container style={{ display: "flex", justifyContent: "center", alignItems: "center", marginTop: "5px" }}>
                            <Button variant="outline-dark" onClick={goBack} style={{ fontSize: "15px" }}> Cancella </Button>

                        </Container>
                    </Form>


                </Container>
            </Container>

        </>
    );

}

export default LoginPage;