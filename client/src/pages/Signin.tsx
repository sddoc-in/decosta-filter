import React from "react";
import SkyBidder from "../components/common/SkyBidder";
// import SigninFacebook from "../components/user/SigninFacebook";
// import SigninGoogle from "../components/user/SigninGoogle";
import { AppContext } from "../context/Context";
import { API_URL } from "../constants/data";
import { Link, useNavigate } from "react-router-dom";
import InputPassword from "../components/input/InputPassword";
import UserErrorInterface from "../interface/Error";
import FormInput from "../components/input/FormInput";
import { Button } from "@chakra-ui/react";

export default function Signin() {

  const {setData: setLoggedInUser,raiseToast,setLoading} = React.useContext(AppContext);
  const navigate = useNavigate();

  const [error, setError] = React.useState<UserErrorInterface>({
    field: "",
    message: "",
    hasError: false,
  });

  const [user, setUser] = React.useState({
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value,
    });
    if (error.hasError) setError({ field: "", message: "", hasError: false });
  };


  async function handleSignIn() {
    try {
      setLoading(true)
      const data = await fetch(
        API_URL + "/login?" + new URLSearchParams(user),
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
        .then((res) => res.json())
        .catch((err) => {
          alert(err.response.data.message);
          setLoading(false)
          return;
        });

      if (data.message === "User logged in successfully") {
        setLoggedInUser(data.user);
        raiseToast("Logged in successfully", "success");
        navigate("/dashboard/searches");

      } else {
        raiseToast(data.message, "error");
      }
    } catch (err) {
      raiseToast("Something went wrong!", "error");
    }
    finally{
      setLoading(false)
    }
  }

  return (
    <div className="relative w-full h-auto md:h-[100vh] overflow-hidden">
      <SkyBidder />
      <div className="w-full md:w-[65%] lg:w-[75%] pb-6 md:absolute top-[30%] md:top-0 right-0 bg-white h-full z-20 rounded-t-3xl lg:rounded-t-[unset] lg:rounded-l-[1.5rem!important] block pt-20 md:pt-0 md:flex items-center justify-center">
        <div className="w-[80%] mx-auto">
          <h1 className="text-black font-bold text-[32px]">
            Log in to your account
          </h1>
          {/* <div className="flex justify-evenly w-full items-center my-5 flex-col lg:flex-row">
            <SigninGoogle />
            <SigninFacebook />
          </div> */}
          {/* <p className="w-fit mx-auto text-[#878787] text-[26px]">- OR -</p> */}
          <div className="w-full md:w-10/12 mx-auto text-start my-6">
            <FormInput
              label="Email"
              handleChange={handleChange}
              name="email"
              isRequired={true}
              isInvalid={error.field === "email"}
              error={error.message}
              placeholder="Enter email"
              focus="password"
            />

            <InputPassword
              label="Password"
              handleChange={handleChange}
              name="password"
              isRequired={true}
              isInvalid={error.field === "password"}
              error={error.message}
              placeholder="Enter password"
              onKeyPress={(e) => {
                if (e.key === "Enter") handleSignIn();
              }}
            />
            <Link
              to="/password/forget"
              className="text-blue-500 text-md cursor-pointer block w-fit mr-0 my-1 ml-auto"
            >
              Forgot password?
            </Link>

            <Button
              onClick={handleSignIn}
              className="w-full mt-4 !bg-[#004d3d] !text-white"
            >
              Sign in
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}