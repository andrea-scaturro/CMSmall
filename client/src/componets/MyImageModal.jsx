import React from "react";
import { Modal, Row, Col, Button, Text } from "@nextui-org/react";
import { useState } from "react";

export default function ImageModal(props) {

    const [visible, setVisible] = useState(props.visible);
    const [image, setImage] = useState(props.image);

    const URL = 'http://localhost:3005/';
    

    const closeHandler = (path) => {

        props.setShowImageModal(false);
        setVisible(false);
        if (path != null) {
            props.addImage(path);
        }

    };


    return (
        <div>
            <Modal
                width="800px"
                closeButton
                blur
                aria-labelledby="modal-title"
                open={visible}
                onClose={closeHandler}
            >
                <Modal.Header>
                    <Text id="modal-title" size={18}>
                        Choose from these !
                    </Text>
                </Modal.Header>
                <Modal.Body >
                    {image ? (
                        <div >
                            {/* per fare una tabella n*2 */}
                            {image.reduce((rows, elem, index) => {
                                if (index % 2 === 0) {
                                    rows.push([]);
                                }
                                rows[rows.length - 1].push(elem);
                                return rows;
                            }, []).map((row, rowIndex) => (
                                <Row key={rowIndex} style={{marginBottom:"20px"}}>
                                    {row.map((elem, colIndex) => (
                                        <Col key={colIndex}>
                                            <img
                                                onClick={() => closeHandler(elem.imagePath)}
                                                style={{ height: "200px", width: "350px" }}
                                                src={`${URL + elem.imagePath}`}
                                                alt={`Image ${rowIndex}-${colIndex}`}
                                            />
                                        </Col>
                                    ))}
                                </Row>
                            ))}
                        </div>
                    ) : (
                        ""
                    )}
                </Modal.Body>
                <Modal.Footer>


                </Modal.Footer>
            </Modal>
        </div>
    );
}