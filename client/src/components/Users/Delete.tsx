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
import toTitleCase from "../../functions/toTitle";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  data: any;
  onDelete: () => void;
  type: string;
}

export default function Delete(props: Props) {
  function onDelete() {
    props.onClose();
    props.onDelete();
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
              Do you want to delete this {toTitleCase(props.type)}
              {!(props.type === "url" || props.type === 'form') ? (
                <>
                  - <b> {props.data.username}?</b>
                </>
              ):"?"}
            </p>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={props.onClose}>
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