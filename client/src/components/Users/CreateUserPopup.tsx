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
import InputPass from "../input/InputPass";
import InputEmail from "../input/InputEmail";
import axios from "axios";
import { AppContext } from "../../context/Context";
import UserErrorInterface from "../../interface/Error";
import Users from "../../interface/Users";
import { API_URL } from "../../constants/data";
import validateUser from "../../functions/validateUser";
import InputName from "../input/InputName";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  allUsers: Users[];
  after: (data: Users[]) => void;
}

export default function CreateuserPopup(props: Props) {
  const { user: currentUser,setLoading,raiseToast } = React.useContext(AppContext);

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
        props.after([...props.allUsers, {...panelUser, uid: data.user.uid}]);
        setLoading(false);
      }
    } catch (err) {}
  }

  function ValidateUser() {
    let error: UserErrorInterface = validateUser(panelUser, "", true);
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
          <ModalHeader>Create User</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <InputName
              name="name"
              defValue=""
              placeholder="Name"
              inputClassName="w-full"
              onChangeHandler={onChange}
              error={
                error.hasError && error.field === "name" ? error.message : ""
              }
            />
            <InputName
              name="username"
              defValue=""
              placeholder="Username"
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
              defValue=""
              placeholder="Email"
              inputClassName="w-full"
              onChangeHandler={onChange}
              error={
                error.hasError && error.field === "email" ? error.message : ""
              }
            />

            <InputPass
              name="password"
              defValue=""
              placeholder="Password"
              inputClassName="w-full"
              onChangeHandler={onChange}
              error={
                error.hasError && error.field === "password"
                  ? error.message
                  : ""
              }
            />
            <InputSelect
              name="role"
              selectArray={
                currentUser.role === RolesEnum.ADMIN
                  ? [
                      { name: "Admin", value: RolesEnum.ADMIN },
                      { name: "User", value: RolesEnum.USER },
                    ]
                  : [{ name: "User", value: RolesEnum.USER }]
              }
              onChange={onRoleChange}
              defValue=""
              placeholder="Select your role"
              inputClassName="w-full"
              error={
                error.hasError && error.field === "role" ? error.message : ""
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
