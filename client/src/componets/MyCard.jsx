
import { Card } from '@nextui-org/react';
import { Text, Grid } from '@nextui-org/react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import dayjs from 'dayjs';


function MyCard(props) {


    const navigate = useNavigate();
    const [page, setPage] = useState(props.e);
    const [user, SetUser] = useState(props.user);
    const now = dayjs();

    const URL = 'http://localhost:3005/';

    function handleClick() {
       
        navigate('/' + page.id);
    }

    function handleEdit() {
        navigate('/pages/edit/' + page.id);
    }


    return (
        <>
            <Col style={{marginBottom:"60px"}}>

                <Card

                    isPressable
                    isHoverable
                    variant="bordered"

                    css={{ mw: "400px", height: "100%", width: "400px" }}


                >
                    <Container onClick={handleClick}>
                        <Card.Header style={{ height: "80px" }}>
                            <Text> <strong> {props.e.title} </strong></Text>
                        </Card.Header>

                        <Card.Divider />
                        <Card.Body style={{ height: "200px" }}>
                            <>
                                {props.e.blocks ? props.e.blocks.sort((a, b) => a.orderIndex - b.orderIndex).map((elem) =>
                                    elem.pageId === props.e.id ?

                                        <div key={elem.orderIndex}> {elem.content ? elem.content :
                                            <img src={`${URL + elem.imagePath}`}  ></img>
                                        } </div>
                                        : null
                                )
                                    : ''
                                }


                            </>
                        </Card.Body>
                        <Card.Divider />


                        <Card.Body  >
                            <Text style={{ height: "10px" }}> Author: {props.e.userName} </Text>
                            <Text style={{ height: "10px" }}> Creation Date:  {dayjs(props.e.creationDate).format("YYYY-MM-DD")} </Text>
                            <Text style={{ height: "10px" }}> Publish Date: {props.e.publishDate != null ? dayjs(props.e.publishDate).format("YYYY-MM-DD") : 'Draft'} </Text>


                        </Card.Body>
                    </Container>
                    <Card.Divider />

                    {((((props.loggedIn && props.backoffice) ? user.id : null) === props.e.authorId) || (((user ? user.admin : false) && props.backoffice))) ? <Container>
                        <svg onClick={handleEdit} style={{ marginLeft: "200px" }} xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-pencil" viewBox="0 0 16 16">
                            <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z" />
                        </svg>

                        <svg onClick={() => props.deletePage(page.id)} style={{ marginLeft: "20px" }} xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-trash-fill" viewBox="0 0 16 16">
                            <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z" />
                        </svg>
                    </Container> : ''}



                </Card>


            </Col>
           
        </>
    );
}

export default MyCard;