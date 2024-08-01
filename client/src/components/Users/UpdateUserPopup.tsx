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
import { API_URL } from "../../constants/data";
import UserErrorInterface from "../../interface/Error";
import Users from "../../interface/Users";
import toTitleCase from "../../functions/toTitle";
import { AppContext } from "../../context/Context";
import { UserClientStatus } from "../../constants/UserClientStatus";
import FormInput from "../input/FormInput";
import validateEmail from "../../functions/validateEmail";
import InputSelect from "../input/InputSelect";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  data: Users;
}

export default function UpdateUserPopup(props: Props) {
  const { user: currentUser, setLoading } = React.useContext(AppContext);
  const [panelUser, setPanelUser] = React.useState<Users>(props.data);

  const [error, setError] = React.useState<UserErrorInterface>(
    {} as UserErrorInterface
  );

  async function onCreate() {
    if (!ValidateUser()) {
      return;
    }
    if (
      currentUser.role !== RolesEnum.ADMIN &&
      currentUser.uid !== props.data.uid
    ) {
      alert("You are not allowed to update this user");
      return;
    }

    try {
      setLoading(true);
      const params = new URLSearchParams({
        uid: currentUser.uid,
        access_token: currentUser.access_token,
        session: currentUser.session,
      });

      const data = await axios
        .put(API_URL + "/users/update?" + params, panelUser)
        .then((res) => res.data)
        .catch((err) => {
          let data = err.response.data;
          alert(data.message);
          return;
        });
      if (data.message !== "User updated") {
        alert(data.message);
        setLoading(false);
        return;
      }
      alert("User updated successfully");
      props.onClose();
      setLoading(false);
    } catch (err) {}
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
          <ModalHeader>Update Lawyer - {props.data.username}</ModalHeader>
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
            <InputSelect
              name="role"
              label="Role"
              selectArray={Object.values(RolesEnum).map((item) => {
                return {
                  value: item,
                  name: toTitleCase(item),
                };
              })}
              handleChange={onRoleChange}
              defaultValue={panelUser.role}
              placeholder="Select your role"
              error={
                error.hasError && error.field === "role" ? error.message : ""
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
              Update
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
