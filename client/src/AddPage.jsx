
import { Row, Col, Button, Form, Container, FormControl, Alert } from 'react-bootstrap';
import dayjs from 'dayjs';
import { useNavigate, useParams, Link, Navigate } from 'react-router-dom';
import MyNavbar from './componets/MyNavbar';
import { Card, Textarea } from '@nextui-org/react';
import { Text, Input } from '@nextui-org/react';

import { useState } from 'react';
import ImageModal from './componets/MyImageModal';
import { useRef } from 'react';



function AddForm(props) {

    const [pages, setPages] = useState(props.pages);
    const [blocks, setBlocks] = useState([]);
    const [showFormH, setShowFormH] = useState(false);
    const [showFormP, setShowFormP] = useState(false);
    const [showImageModal, setShowImageModal] = useState(false);
    const [newH, setNewH] = useState();
    const [newP, setNewP] = useState();
    const [showAlert, setShowAlert] = useState(false);
    const [publishDate, setPublishDate] = useState();
    const [errorMsg, setErrorMsg] = useState();
    const [title, setTitle] = useState();

    const divRef = useRef(null);
    const navigate = useNavigate();

    const now = dayjs();
    const URL = 'http://localhost:3005/';

    function handleClick(e) {

        e.preventDefault();

        //check vari

        if (!title) {
            setErrorMsg("Insert a title");
            setShowAlert(true);
        }
        else if (!blocks.length) {
            setErrorMsg("You can't add a empty page!");
            setShowAlert(true);
        }
        else if (!blocks.some(e => e.type === 'h')) {
            setErrorMsg("Miss header");
            setShowAlert(true);
        }
        else if (!blocks.some(e => e.type === 'p' || e.type === 'img')) {
            setErrorMsg("Miss a Paragraph or a Image");
            setShowAlert(true);
        }

        else if ( now.isAfter(publishDate)  && publishDate != null) {

            setErrorMsg("This is not a time machine, you can't set  publish date before today");
            setShowAlert(true);
        }

        else {
            const newPage = { authorId: props.user.id, blocks: blocks, creationDate: now, publishDate: publishDate, title: title }
            newPage.blocks.forEach((element, i) => {
                element.orderIndex = i + 1;
            });
            props.addPage(newPage);
            navigate('/');
        }

    }

    function goBack() { navigate('/'); }


    function goDown(fromIndex, toIndex) {

        const newArray = [...blocks];
        const [removedElement] = newArray.splice(fromIndex, 1);
        newArray.splice(toIndex, 0, removedElement);
        setBlocks(newArray);

    }


    function goUp(fromIndex, toIndex) {

        if (fromIndex != 0) {
            const newArray = [...blocks];
            const [removedElement] = newArray.splice(fromIndex, 1);
            newArray.splice(toIndex, 0, removedElement);
            setBlocks(newArray);
        }
    }

    function handleDelete(e) {

        const newBlocks = blocks.filter(elem => elem.content !== e);
        setBlocks(newBlocks);
    }

    function showHiddenFormH() {

        setShowFormH(!showFormH);
        scrollBottom();
    }

    function showHiddenFormP() {

        setShowFormP(!showFormP);
        scrollBottom();
    }


    function handleChangeTextArea(e,id){
        
        const newBlocks =  blocks.map(elem=> {
             if(elem.id ==id && elem.type == 'p'){
                 return {...elem, content:e.target.value }}
             else return{...elem}
        })
        setBlocks(newBlocks)      
     }
 
 
     function handleChangeHeader(e,id){
         
         const newBlocks =  blocks.map(elem=> {
              if(elem.id ==id && elem.type == 'h'){
                  return {...elem, content:e.target.value } }
              else return{...elem}
         })
         setBlocks(newBlocks)      
      }

      
    function addHeader() {
        if (newH) {

            const newHeader = { content: newH, imagePath: null, type: 'h', orderIndex: Math.max(...blocks.map(e => e.orderIndex)) + 1 };
            setBlocks([...blocks, newHeader])
            setShowFormH(!showFormH);
        } else {
            setErrorMsg("Insert header's content");
            setShowAlert(true);
        }
    }

    function addParagraph() {

        if (newP) {

            const newParagraph = { content: newP, imagePath: null, pageId: Math.max(...pages.map(e => e.id)) + 1, type: 'p', orderIndex: Math.max(...blocks.map(e => e.orderIndex)) + 1 };
            setBlocks([...blocks, newParagraph])
            setShowFormP(!showFormP);
        } else {
            setErrorMsg("Insert paragraph's content");
            setShowAlert(true);
        }
    }
    function addImage(path) {

        const newImg = { content: null, imagePath: path, pageId: pages.lenght === 0 ? 0 : Math.max(...pages.map(e => e.id)) + 1, type: 'img', orderIndex: Math.max(...blocks.map(e => e.orderIndex)) + 1 };
        setBlocks([...blocks, newImg])
        scrollBottom();

    }

    function scrollBottom() {

        if (divRef.current) {
            divRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
        }
    }

    return (
        <>
            <MyNavbar title={props.title} changeTitle={props.changeTitle} logout={props.logout} loggedIn={props.loggedIn} user={props.user} />
            {showAlert && <Alert variant='danger' onClose={() => setShowAlert(false)} dismissible>{errorMsg} </Alert>}


            <Container style={{ marginTop: "30px", overflow: 'scroll', maxHeight: "750px" }}>

                <Row>

                    <Col>

                        <Card isHoverable variant="bordered" bg="dark" css={{ height: "600px" }}>
                            <Card.Header>
                                <Input aria-labelledby='none' onChange={(e) => setTitle(e.target.value)} placeholder='Insert title' />
                            </Card.Header>

                            <Card.Divider />

                            <Card.Body css={{ height: "600px" }}>

                                <div ref={divRef}>
                                    <Form onSubmit={(e) => handleClick(e)}>

                                        {blocks ? blocks.map((e, i) => <Row e={e} key={i}>
                                            <Col xs={9}>
                                                {e.imagePath ? <img src={`${URL + e.imagePath}`} style={{ marginBottom: "10px", marginTop: "10px" }}></img> :
                                                    (e.type == 'h' ? <Input aria-labelledby='none' labelRight={e.type} bordered width="100%" placeholder={e.content} onChange={(elem)=>handleChangeHeader(elem, e.id)} />
                                                        : <Textarea aria-labelledby='none' labelRight={e.type} bordered width="100%" placeholder={e.content}  onChange={(elem)=>handleChangeTextArea(elem, e.id)}/>)}

                                            </Col>
                                            <Col>
                                                <Button onClick={() => goUp(i, i - 1)} style={{ color: "black", backgroundColor: "white", borderColor: "white" }}><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-arrow-up" viewBox="0 0 16 16">
                                                    <path fillRule="evenodd" d="M8 15a.5.5 0 0 0 .5-.5V2.707l3.146 3.147a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 1 0 .708.708L7.5 2.707V14.5a.5.5 0 0 0 .5.5z" />
                                                </svg></Button>

                                                <Button onClick={() => goDown(i, i + 1)} style={{ color: "black", backgroundColor: "white", borderColor: "white" }}><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-arrow-down" viewBox="0 0 16 16">
                                                    <path fillRule="evenodd" d="M8 1a.5.5 0 0 1 .5.5v11.793l3.146-3.147a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 .708-.708L7.5 13.293V1.5A.5.5 0 0 1 8 1z" />
                                                </svg></Button>
                                            </Col>

                                            <Col>
                                                <Button onClick={() => handleDelete(e.content)} style={{ color: "black", backgroundColor: "white", borderColor: "white" }}>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="currentColor" className="bi bi-x" viewBox="0 0 16 16">
                                                        <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" />
                                                    </svg>
                                                </Button>
                                            </Col>
                                        </Row>) : ''}

                                        <br></br>
                                        <br></br>

                                        {showFormH && <Row>
                                            <Col xs={9} >
                                                <Input
                                                    aria-labelledby='none'
                                                    onChange={(e) => setNewH(e.target.value)}
                                                    underlined
                                                    clearable
                                                    width='100%'
                                                    labelPlaceholder="Insert a new header"
                                                    color="default" />
                                            </Col>

                                            <Col >
                                                <Button onClick={addHeader} variant="dark">+</Button>
                                            </Col>

                                            <Col>
                                                <Button onClick={showHiddenFormH} style={{ color: "black", backgroundColor: "white", borderColor: "white" }}>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" className="bi bi-x" viewBox="0 0 16 16">
                                                        <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" />
                                                    </svg>
                                                </Button>
                                            </Col>

                                        </Row>}
                                        <br></br>
                                        <br></br>
                                        {showFormP && <Row >
                                            <Col xs={9} >
                                                <Textarea
                                                    aria-labelledby='none'
                                                    onChange={(e) => setNewP(e.target.value)}
                                                    underlined
                                                    clearable
                                                    width='100%'
                                                    labelPlaceholder="Insert a new paragraph"
                                                    color="default" />
                                            </Col>

                                            <Col  >
                                                <Button onClick={addParagraph} variant="dark">+</Button>
                                            </Col>
                                            <Col >
                                                <Button onClick={showHiddenFormP} style={{ color: "black", backgroundColor: "white", borderColor: "white" }}>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" className="bi bi-x" viewBox="0 0 16 16">
                                                        <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" />
                                                    </svg>
                                                </Button>
                                            </Col>

                                        </Row>}
                                        <Row>
                                            <br></br>
                                            <br></br>
                                            <br></br>
                                        </Row>

                                        {showImageModal && <ImageModal image={props.image} visible={showImageModal} addImage={addImage} setShowImageModal={setShowImageModal}></ImageModal>}

                                    </Form>
                                </div>

                            </Card.Body>

                            <Card.Body css={{ height: "350px" }} >
                                <Row style={{ marginLeft: "5px" }}>
                                    <Button style={{ width: "200px" }} onClick={showHiddenFormH} variant="outline-dark">Add Header</Button>
                                    <Button onClick={showHiddenFormP} style={{ marginRight: "10px", marginLeft: "10px", width: "200px" }} variant="outline-dark">Add Paragrafo</Button>
                                    <Button style={{ width: "200px" }} onClick={() => { setShowImageModal(true) }} variant="outline-dark">Add Image</Button>

                                </Row>
                                <br></br>

                                <Text style={{ height: "10px" }}> Author: {props.user.name} </Text>
                                <Text style={{ height: "10px" }}> Creation Date: {now.format("YYYY-MM-DD")} </Text>
                                <div style={{ height: "10px", marginTop: "10px" }}> Publish Date:<Input aria-labelledby='none' width="186px" onChange={(e) => setPublishDate(dayjs(e.target.value))} placeholder="Publish Date" type="date" />  </div>
                            </Card.Body>

                        </Card>

                    </Col>

                </Row>
                <br></br>
                <Button type='submit' onClick={goBack} variant="danger" style={{ marginRight: "15px" }}> Cancel</Button>

                <Button onClick={(e) => handleClick(e)} variant="dark" > Add Page </Button>

            </Container>

        </>
    );

}
export default AddForm;