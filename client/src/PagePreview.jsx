import { Button, Container, Row } from "react-bootstrap";
import MyNavbar from "./componets/MyNavbar";
import {  useNavigate, useParams } from "react-router-dom";
import dayjs from "dayjs";
import { useState } from "react";

function Page(props) {

    const navigate = useNavigate();

    const id = useParams().id;

    function handleClick() {
        navigate('/');
    }

    const [page, setPage] = useState(props.pages.filter(e => e.id == id)[0]);

    const URL = 'http://localhost:3005/';

    return (
        <>
            <MyNavbar
                title={props.title}
                logout={props.logout} loggedIn={props.loggedIn} user={props.user}  ></MyNavbar>

            <Container style={{ marginTop: "50px", marginBottom: "20px" }}>

                <Button onClick={handleClick} style={{ background: "white", borderColor: "white", color: "black" }} >
                    <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" fill="currentColor" className="bi bi-arrow-left" viewBox="0 0 16 16">
                        <path fillRule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z" />
                    </svg>
                </Button>

            </Container>
            <Container fluid style={{ overflow: 'scroll', maxHeight: "600px" }}>
                <Container style={{ display: "flex", justifyContent: "center", alignItems: "center", marginTop: "50px" }}>

                    <h1>
                        {page.title}
                    </h1>

                </Container>

                <Container style={{ display: "flex", justifyContent: "center", alignItems: "center", marginTop: "50px" }}>
                    <Row >
                        {page.blocks ? page.blocks.sort((a, b) => a.orderIndex - b.orderIndex).map((elem) =>
                            elem.pageId == id ?

                                <div style={{ marginBottom: "20px" }} key={elem.orderIndex}>

                                    {elem.type === 'h' ? <h3>{elem.content}</h3> : elem.type === 'p' ? <p>{elem.content}</p> :
                                        <img style={{ height: "200px", width: "400px" }} src={`${URL + elem.imagePath}`}  ></img>
                                    } </div>
                                : null
                        )
                            : ''
                        }
                    </Row>

                </Container>
                <Container style={{ }}>
                    <Row>
                        <p style={{ height: "10px" }}> Author: {page.userName} </p>
                        <p style={{ height: "10px" }}> Creation Date:  {dayjs(page.creationDate).format("DD-MM-YYYY")} </p>
                        <p style={{ height: "10px" }}> Publish Date: {page.publishDate ? dayjs(page.publishDate).format("DD-MM-YYYY") : ''} </p>

                    </Row>
                </Container>

            </Container>
        </>
    );

}
export default Page;