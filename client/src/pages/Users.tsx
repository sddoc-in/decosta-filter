import React from "react";
import { IoMdAdd } from "react-icons/io";
import { AppContext } from "../context/Context";
import { API_URL } from "../constants/data";
import axios from "axios";
import InputSearch from "../components/input/InputSearch";
import RolesEnum from "../constants/Roles";
import Users from "../interface/Users";
import CreateuserPopup from "../components/Users/CreateUserPopup";
import Card from "../components/Users/UserCard";

export default function UsersPage() {
  const { user: currentUser, setLoading } = React.useContext(AppContext);
  const [data, setData] = React.useState<Users[]>([]);
  const [isPopupOpen, setIsPopupOpen] = React.useState(false);
  const [query, setQuery] = React.useState<string>("");

  const openPopup = () => {
    setIsPopupOpen(true);
  };

  const getAllUsers = React.useRef(() => { });

  getAllUsers.current = async () => {
    if (!currentUser.uid) {
      return;
    }
    try {
      setLoading(true);
      const params = new URLSearchParams();
      params.append("uid", currentUser.uid);
      params.append("session", currentUser.session);
      params.append("token", currentUser.access_token);


      const data = await axios
        .get(API_URL + "/users/all?" + params)
        .then((res) => res.data)
        .catch((err) => {
          alert(err.response.data.message);
          setLoading(false);
          return;
        });
      if (data) {
        setData(data);
      }
      setLoading(false);
    } catch (err) { }
  };

  React.useEffect(() => {
    getAllUsers.current();
  }, [currentUser]);

  return (
    <>
      <h1 className=" text-3xl text-start text-black ">Users</h1>
      {currentUser.role === RolesEnum.ADMIN && (
        <div
          className="bg-[#002F53] text-white text-[16px] leading-[20px] rounded-md mt-4 flex justify-center items-center mb-2 w-fit px-4 py-2 cursor-pointer"
          onClick={openPopup}
        >
          <IoMdAdd className="mr-2 text-[20px] " />
          Create
        </div>
      )}
      <InputSearch
        name="search"
        defValue=""
        placeholder="Search"
        inputClassName="md:w-1/2 w-11/12 mx-auto"
        onChangeHandler={(e) => setQuery(e.target.value)}
      />
      {data.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2  gap-2 w-[95%] mx-auto">
          {data
            .filter((user: Users) =>
              user.username!.toLowerCase().includes(query.toLowerCase())
            )
            .map((user, index) => {
              return <Card key={index} data={user} canDelete={true} after={setData} allUsers={data} />;
            })}
        </div>
      ) : (
        <p>No Users Found</p>
      )}

      <CreateuserPopup
        isOpen={isPopupOpen}
        allUsers={data}
        onClose={() => {
          setIsPopupOpen(false)
        }}
        after={setData}
      />
    </>
  );
}
