import React from "react";
import { Modal, Row, Col, Button, Text } from "@nextui-org/react";
import { useState } from "react";

export default function ErrorModal(props) {

    const [visible, setVisible] = useState(props.visible);
        

    const closeHandler = (path) => {

        props.setShowError(false);
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
                        Error!
                    </Text>
                </Modal.Header>
                <Modal.Body >
                    {props.errorMsg}
                  
                </Modal.Body>
               
            </Modal>
        </div>
    );
}