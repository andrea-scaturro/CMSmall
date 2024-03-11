
import { Row, Col, Button, Form, Container, Alert } from 'react-bootstrap';
import dayjs from 'dayjs';
import { useNavigate, useParams } from 'react-router-dom';
import MyNavbar from './componets/MyNavbar';
import { Card, Loading } from '@nextui-org/react';
import { Text, Input, Textarea } from '@nextui-org/react';
import { useState } from 'react';
import ImageModal from './componets/MyImageModal';
import { useRef } from 'react';
import { useEffect } from 'react';


function EditForm(props) {

    const id = useParams().id;
    const navigate = useNavigate();

    const [page, setPage] = useState(props.pages.filter(e => e.id == id)[0]);
    const [blocks, setBlocks] = useState(page.blocks);
    const [showFormH, setShowFormH] = useState(false);
    const [showFormP, setShowFormP] = useState(false);
    const [showImageModal, setShowImageModal] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const [errorMsg, setErrorMsg] = useState();
    const [author, setAuthor] = useState({});

    const URL = 'http://localhost:3005/';
    const divRef = useRef(null);
    const now = dayjs();


    useEffect(() => {

        if (props.user.admin) {
            setAuthor(props.users[page.authorId - 1])
        }
        else {
            setAuthor(props.user)
        }
    }, []);


    const [title, setTitle] = useState(page.title);
    const [newH, setNewH] = useState();
    const [newP, setNewP] = useState();
    const [publishDate, setPublishDate] = useState(page.publishDate);

    function handleClick(e) {

        e.preventDefault();

        if (!blocks.length) {
            setErrorMsg("You can't update a empty page!");
            setShowAlert(true);
        }
        else if (!blocks.some(e => (e.type === 'h' && e.content != null))) {
            setErrorMsg("Miss header");
            setShowAlert(true);
        }
        else if (!blocks.some(e => (e.type === 'p' && e.content != null) || e.type === 'img')) {
            setErrorMsg("Miss a Paragraph or a Image");
            setShowAlert(true);
        }
        else if (title === null) {
            setErrorMsg("Insert a title");
            setShowAlert(true);
        }

        else if (!(now.isSame(publishDate) || now.isBefore(publishDate)) && publishDate != null) {

            setErrorMsg("You can't set publish date before today");
            setShowAlert(true);
        }
        else {

            if (props.user.admin) {
                const newAuthorId = props.users.filter((e) => {
                    if (e.email == author.email) {
                        return e.id
                    }
                })

                const pageEdited = { ...page, blocks: blocks, title: title, publishDate: publishDate, authorId: newAuthorId[0].id }
                pageEdited.blocks.forEach((element, i) => {
                    element.orderIndex = i + 1;
                });
                console.log(pageEdited)
                props.editPage(pageEdited);
            }
            else {
                const pageEdited = { ...page, blocks: blocks, title: title, publishDate: publishDate, authorId: page.authorId }
                pageEdited.blocks.forEach((element, i) => {
                    element.orderIndex = i + 1;
                });
                
                props.editPage(pageEdited);
            }
            navigate('/');
        }
    }

    function goBack() {
        navigate('/');
    }


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

    function handleDelete(i) {

        const newBlocks = blocks.filter(elem => elem.orderIndex !== i);
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
            const newHeader = { id: Math.max(...blocks.map(e => e.id)) + 1, content: newH, imagePath: null, pageId: page.id, type: 'h', orderIndex: Math.max(...blocks.map(e => e.orderIndex)) + 1 };
            setBlocks([...blocks, newHeader])
            setShowFormH(!showFormH);
        }
        else {
            setErrorMsg("Insert header's content");
            setShowAlert(true);
        }
    }

    function addParagraph() {

        if (newP) {
            const newParagraph = { id: Math.max(...blocks.map(e => e.id)) + 1, content: newP, imagePath: null, pageId: page.id, type: 'p', orderIndex: Math.max(...blocks.map(e => e.orderIndex)) + 1 };
            setBlocks([...blocks, newParagraph])
            setShowFormP(!showFormP);
        }
        else {
            setErrorMsg("Insert paragraph's content");
            setShowAlert(true);
        }
    }

    function addImage(path) {

        const newImg = { id: Math.max(...blocks.map(e => e.id)) + 1, content: null, imagePath: path, pageId: page.id, type: 'img', orderIndex: Math.max(...blocks.map(e => e.orderIndex)) + 1 };
        setBlocks([...blocks, newImg])
        scrollBottom();
    }

    function scrollBottom() {

        if (divRef.current) {
            divRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
        }
    }

    function handlePublishDate(e) {

        if (e.target.value) {
            setPublishDate(dayjs(e.target.value))
        }
        else {
            setPublishDate(null);
        }
    }

    return (
        <>
            <MyNavbar title={props.title} changeTitle={props.changeTitle} logout={props.logout} loggedIn={props.loggedIn} user={props.user} />
            {showAlert && <Alert variant='danger' onClose={() => setShowAlert(false)} dismissible>{errorMsg} </Alert>}
            <br></br>
            <Container style={{ marginTop: "20px", overflow: 'scroll', maxHeight: "800px" }}>

                <Row>
                    <Col>
                        <Card isHoverable variant="bordered" bg="dark" css={{ height: "650px" }}>
                            <Card.Header>
                                <Input aria-labelledby='none' onChange={(e) => setTitle(e.target.value)} initialValue={title} />
                            </Card.Header>
                            <Card.Divider />
                            <Card.Body css={{ height: "600px" }}>
                                <div ref={divRef}>

                                    <Form onSubmit={(e) => handleClick(e)}>
                                        {
                                            blocks ? blocks.map((e, i) => <Row e={e} key={i}>

                                                <Col xs={9}>
                                                    {e.imagePath ? <img src={`${URL + e.imagePath}`} style={{ marginBottom: "10px", marginTop: "10px" }}></img> :
                                                        (e.type === 'h' ? <Input aria-labelledby='none' labelRight={e.type} bordered width="100%" placeholder={e.content} onChange={(elem)=>handleChangeHeader(elem, e.id)} />
                                                            : <Textarea aria-labelledby='none' labelRight={e.type} bordered width="100%" placeholder={e.content} onChange={(elem)=>handleChangeTextArea(elem, e.id)} />)}

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
                                                    <Button onClick={() => handleDelete(e.orderIndex)} style={{ color: "black", backgroundColor: "white", borderColor: "white" }}>
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="currentColor" className="bi bi-x" viewBox="0 0 16 16">
                                                            <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" />
                                                        </svg>
                                                    </Button>
                                                </Col>
                                            </Row>) : <Loading type="points" />}

                                        <br></br>
                                        <br></br>

                                        {showFormH && <Row>
                                            <Col xs={9} >
                                                <Input aria-labelledby='none'
                                                    onChange={(e) => setNewH(e.target.value)}
                                                    underlined
                                                    clearable
                                                    width='100%'
                                                    labelPlaceholder="Inserisci nuovo header"
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
                                                <Textarea aria-labelledby='none'
                                                    onChange={(e) => setNewP(e.target.value)}
                                                    underlined
                                                    clearable
                                                    width='100%'
                                                    labelPlaceholder="Inserisci nuovo paragrafo"
                                                    color="default" />
                                            </Col>

                                            <Col >
                                                <Button onClick={addParagraph} variant="dark">+</Button>
                                            </Col>
                                            <Col>
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
                                        
                                        {showImageModal && <ImageModal image={props.image} addImage={addImage} visible={showImageModal} setShowImageModal={setShowImageModal}></ImageModal>}

                                    </Form>
                                </div>
                            </Card.Body>

                            <Card.Body css={{ height: "320px" }} >
                                <Row style={{ marginLeft: "5px" }}>
                                    <Button style={{ width: "200px", }} onClick={showHiddenFormH} variant="outline-dark" >Add Header</Button>
                                    <Button onClick={showHiddenFormP} style={{ marginRight: "10px", marginLeft: "10px", width: "200px" }} variant="outline-dark">Add Paragraph</Button>
                                    <Button style={{ width: "200px" }} onClick={() => setShowImageModal(true)} variant="outline-dark">Add Image</Button>

                                </Row>
                                <br></br>
                                <Container style={{ height: "10px", marginTop: "0px", marginBottom: "30px" }}>
                                    <Text style={{ height: "10px" }} >

                                        Author: {props.user.admin ? <select onChange={(e) => {
                                            setAuthor(
                                                { ...author, email: e.target.value })
                                        }}
                                            style={{ height: "40px", width: "250px", borderRadius: "30px" }} value={author.email}>
                                            {props.users ? props.users.map((elem) => <option key={elem.id}>{elem.email} </option>) : ''}
                                        </select> : props.user.email}
                                    </Text>
                                </Container>
                                <Text style={{ height: "8px", marginLeft: "12px" }}> Creation Date:  {dayjs(page.creationDate).format("DD-MM-YYYY")} </Text>
                                <div style={{ height: "8px", marginTop: "10px", marginLeft: "12px" }}> Publish Date:<Input aria-labelledby='none' width="186px"
                                    onBlur={handlePublishDate}
                                    initialValue={publishDate ? dayjs(publishDate).format('YYYY-MM-DD') : ''} type="date" />  </div>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
                <br></br>
                <Button type='submit' onClick={goBack} variant="danger" style={{ marginRight: "15px" }}> Cancel</Button>

                <Button onClick={handleClick} variant="dark" > Update </Button>
            </Container>
        </>
    );

}

export default EditForm;