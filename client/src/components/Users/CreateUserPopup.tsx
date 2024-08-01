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
import RolesEnum from "../../constants/Roles";
import axios from "axios";
import { AppContext } from "../../context/Context";
import UserErrorInterface from "../../interface/Error";
import Users from "../../interface/Users";
import { API_URL } from "../../constants/data";
import validateEmail from "../../functions/validateEmail";
import FormInput from "../input/FormInput";
import { UserClientStatus } from "../../constants/UserClientStatus";
import InputSelect from "../input/InputSelect";
import InputPassword from "../input/InputPassword";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  allUsers: Users[];
  after: (data: Users[]) => void;
}

export default function CreateuserPopup(props: Props) {
  const { user: currentUser, setLoading, raiseToast } = React.useContext(AppContext);

  const [error, setError] = React.useState<UserErrorInterface>(
    {} as UserErrorInterface
  );

  const [panelUser, setPanelUser] = React.useState<Users>({} as Users);

  async function onCreate() {
    if (!ValidateUser()) {
      return;
    }

    if (currentUser.role !== RolesEnum.ADMIN && currentUser.uid) {
      alert("You are not allowed to create a user");
      return;
    }

    try {
      setLoading(true);
      const params = {
        uid: currentUser.uid,
        access_token: currentUser.access_token,
        session: currentUser.session,
      };

      const data = await axios
        .post(API_URL + "/users/create", { ...panelUser, ...params })
        .then((res) => res.data)
        .catch((err) => {
          let data = err.response.data;
          alert(data.message);
          setLoading(false);
          return;
        });
      if (data.message !== "User created successfully") {
        raiseToast(data.errors.message || data.message, "error");
      }
      if (data.user.uid) {
        raiseToast("User created successfully", "success");
        props.onClose();
        props.after([...props.allUsers, { ...panelUser, uid: data.user.uid }]);
        setLoading(false);
      }
    } catch (err) { }
  }

  function ValidateUser() {
    let error = validateEmail(panelUser.email);
    if (error) {
      setError({ field: "email", message: error, hasError: true });
      return false;
    }

    if (!panelUser.username) {
      setError({ field: "username", message: "Username is required", hasError: true });
      return false;
    }

    if (!panelUser.name) {
      setError({ field: "name", message: "Name is required", hasError: true });
      return false;
    }

    return true;
  }

  function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    setPanelUser({
      ...panelUser,
      [e.target.name]: e.target.value,
    });
  }

  function onRoleChange(name: string, value: string) {
    setPanelUser({
      ...panelUser,
      [name]: value,
    });
  }

  return (
    <>
      <Modal isOpen={props.isOpen} onClose={props.onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create User</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormInput
              label="Name"
              handleChange={onChange}
              name="name"
              isRequired={true}
              isInvalid={error.field === "name"}
              error={error.message}
              placeholder="Enter Name"
              focus="username"
            />
            <FormInput
              label="UserName"
              handleChange={onChange}
              name="username"
              isRequired={true}
              isInvalid={error.field === "username"}
              error={error.message}
              placeholder="Enter UserName"
              focus="email"
            />
            <FormInput
              label="Email"
              handleChange={onChange}
              name="email"
              isRequired={true}
              isInvalid={error.field === "email"}
              error={error.message}
              placeholder="Enter email"
              focus="role"
            />

            <InputPassword
              label="Password"
              name="password"
              defaultValue=""
              placeholder="Password"
              handleChange={onChange}
              error={
                error.hasError && error.field === "password"
                  ? error.message
                  : ""
              }
            />
            <InputSelect
              name="status"
              label="Status"
              defaultValue={panelUser.status}
              selectArray={UserClientStatus}
              handleChange={onRoleChange}
              placeholder="Select your status"
              error={
                error.hasError && error.field === "status" ? error.message : ""
              }
            />
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={props.onClose}>
              Close
            </Button>
            <Button
              variant="ghost"
              onClick={onCreate}
              className="bg-[#002F53] text-[white!important] capitalize hover:bg-[#002F53!important] "
            >
              Create
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
