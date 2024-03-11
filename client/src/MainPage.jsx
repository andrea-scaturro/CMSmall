import MyNavbar from "./componets/MyNavbar";
import MyCard from "./componets/MyCard";
import { Loading } from '@nextui-org/react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { useState } from "react";
import {  useNavigate } from "react-router-dom";
import dayjs from "dayjs";



function MainPage(props) {

    const navigate = useNavigate();
    const now = dayjs();
    const [backoffice, setBackOffice] = useState(false);

    function addPage() { navigate('/add-page') }


    return (
        <>
            <MyNavbar backoffice={backoffice} setBackOffice={setBackOffice} title={props.title} changeTitle={props.changeTitle} logout={props.logout} loggedIn={props.loggedIn} user={props.user} flag={1} />

            <Container fluid style={{ overflow: 'scroll', maxHeight:"750px" }}>
                 <Container style={{ fontFamily: "Verdana", display: "flex", justifyContent: "center", alignItems: "center", marginTop: "100px" }}>
                    <h1> {props.title}, Everything you need  </h1>                
                </Container>
                <Container style={{ fontFamily: "Verdana", display: "flex", justifyContent: "center", alignItems: "center" }}>
                    <h1> in a small package </h1>                

                </Container>
                <Container style={{display: "flex", justifyContent: "center", alignItems: "center", marginTop: "50px" }}>
                    {(props.loggedIn && backoffice) && (<Button onClick={addPage} style={{fontSize: "20px", borderRadius: "100px", width: "300px" }} variant="dark"  >Add  New Page</Button>) }
                    
                </Container>       
              
                <Container style={{display: "flex", justifyContent: "center", alignItems: "center", marginTop: "50px" }}>

                    <Row >

                        {props.pages ? props.pages.sort((a, b) => dayjs(a.publishDate).diff(b.publishDate)).map((e) => (((e.publishDate ? (now.diff(e.publishDate) > 0) : 0) || (props.loggedIn && backoffice))) && <MyCard  backoffice={backoffice} user={props.user} loggedIn={props.loggedIn} blocks={props.blocks} e={e} key={e.id}  deletePage={props.deletePage}></MyCard>) :
                            <Loading type="points" />}

                    </Row>

                </Container>
            </Container>
        </>
    );

}

export default MainPage;
