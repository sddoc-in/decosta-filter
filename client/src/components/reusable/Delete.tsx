import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  Button,
  ModalCloseButton,
} from "@chakra-ui/react";
import React from "react";
import toTitleCase from "../../functions/toTitle";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  data: any;
  onDelete: (data: any) => void;
  type: string;
}

export default function Delete(props: Props) {
  function onDelete() {
    props.onClose();
    props.onDelete(props.data);
  }

  return (
    <>
      <Modal isOpen={props.isOpen} onClose={props.onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Delete {toTitleCase(props.type)}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <p>
              Do you want to delete this {toTitleCase(props.type)} -{" "}
              {props.type === "phrase"
                ? props.data.phrase
                : props.type === "discord-user"
                ? props.data.username
                : props.type === "panel-user"
                ? props.data.name
                : ""}
              ?{" "}
            </p>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3}>
              Close
            </Button>
            <Button variant="ghost" onClick={onDelete} colorScheme="red">
              Delete
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
