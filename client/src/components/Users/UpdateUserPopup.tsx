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
import InputSelect from "../input/InputSelect";
import RolesEnum from "../../constants/Roles";
import InputEmail from "../input/InputEmail";
import InputName from "../input/InputName";
import axios from "axios";
import { API_URL } from "../../constants/data";
import UserErrorInterface from "../../interface/Error";
import validateUser from "../../functions/validateUser";
import Users from "../../interface/Users";
import toTitleCase from "../../functions/toTitle";
import { AppContext } from "../../context/Context";
import { UserClientStatus } from "../../constants/UserClientStatus";

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
    let error: UserErrorInterface = validateUser(panelUser, "", false);
    if (error.hasError) {
      setError(error);
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
            <InputName
              name="name"
              defValue={panelUser.name || ""}
              placeholder="Name"
              inputClassName="w-full"
              onChangeHandler={onChange}
              error={
                error.hasError && error.field === "name" ? error.message : ""
              }
            />
            <InputName
              name="username"
              defValue={panelUser.username || ""}
              placeholder="Username"
              disabled={true}
              inputClassName="w-full"
              onChangeHandler={onChange}
              error={
                error.hasError && error.field === "username"
                  ? error.message
                  : ""
              }
            />
            <InputEmail
              name="email"
              defValue={panelUser.email || ""}
              placeholder="Email"
              inputClassName="w-full"
              onChangeHandler={onChange}
              error={
                error.hasError && error.field === "email" ? error.message : ""
              }
            />
            <InputSelect
              name="role"
              selectArray={Object.values(RolesEnum).map((item) => {
                return {
                  value: item,
                  name: toTitleCase(item),
                };
              })}
              onChange={onRoleChange}
              defValue={toTitleCase(panelUser.role || "")}
              placeholder="Select your role"
              inputClassName="w-full"
              error={
                error.hasError && error.field === "role" ? error.message : ""
              }
            />
            <InputSelect
              name="status"
              selectArray={UserClientStatus}
              onChange={onRoleChange}
              defValue={toTitleCase(panelUser.status || "")}
              placeholder="Select your status"
              inputClassName="w-full"
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
