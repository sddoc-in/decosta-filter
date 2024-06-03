import React, { useState } from "react";
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, Button } from "@chakra-ui/react";
import InputName from "../input/InputName";
import InputEmail from "../input/InputEmail";
import InputPass from "../input/InputPass";
import UserErrorInterface from "../../interface/Error";
import User from "../../interface/Users";
import { v4 as uuidv4 } from "uuid";
import Loading from "../loader/Loading";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onCreateUser: (user: User) => void; 
}

const CreateUserPopup: React.FC<Props> = ({ isOpen, onClose, onCreateUser }) => {
  const [user, setUser] = useState<User>({
    userId: "",
    name: "",
    username: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState<UserErrorInterface>({
    hasError: false,
    field: "",
    message: "",
  });

  const [load, setLoad ] = React.useState(true);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setLoad(false);
    }, 2000);
  
    return () => clearTimeout(timer);
  }, []);


  const createUser = async () => {
    const userId = uuidv4();
    const newUser: User = { ...user, userId };

    try {
      console.log("New User:", newUser);

      onCreateUser(newUser); 
      onClose();
      setUser({
        userId: "",
        name: "",
        username: "",
        email: "",
        password: "",
      }); 
    } catch (err) {
      console.error("Error creating user:", err);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <>
    {load && <Loading />}
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Create User</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <InputName
            name="name"
            defValue=""
            placeholder="Name"
            inputClassName="w-full"
            value={user.name}
            onChangeHandler={handleChange}
            error={error.hasError && error.field === "name" ? error.message : ""}
          />
          <InputName
            name="username"
            defValue=""
            placeholder="Username"
            inputClassName="w-full"
            value={user.username}
            onChangeHandler={handleChange}
            error={error.hasError && error.field === "username" ? error.message : ""}
          />
          <InputEmail
            name="email"
            defValue=""
            placeholder="Email"
            inputClassName="w-full"
            value={user.email}
            onChangeHandler={handleChange}
            error={error.hasError && error.field === "email" ? error.message : ""}
          />
          <InputPass
            name="password"
            defValue=""
            placeholder="Password"
            inputClassName="w-full"
            value={user.password}
            onChangeHandler={handleChange}
            error={error.hasError && error.field === "password" ? error.message : ""}
          />
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={onClose}>
            Close
          </Button>
          <Button
            variant="ghost"
            onClick={createUser}
            className="bg-[#002F53] text-[white!important] capitalize hover:bg-[#002F53!important] "
          >
            Create
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
    </>
  );
};

export default CreateUserPopup;