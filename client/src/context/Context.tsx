import React from "react";
import Loading from "../components/loader/Loading";
import { useNavigate } from "react-router-dom";
import { useToast } from "@chakra-ui/react";
import APIParams from "../constants/SearchParams";

export const AppContext = React.createContext<any>({});

export const AppProvider = ({ children }: any) => {
  const navigate = useNavigate();
  const toast = useToast();

  let notSignIn = React.useRef(()=>{})
  const [show, setShow] = React.useState(1)
  const [user, setUser] = React.useState({
    username: "",
    session: "",
    access_token: "",
    uid: "",
    role: "",
  });

  const [apiParams, setApiParams] = React.useState<any>(APIParams);

  const [loading, setLoading] = React.useState<boolean>(false);

  function setData(data: any) {
    setDataForUser({
      uid: data.uid,
      access_token: data.access_token,
      session: data.session,
      name: data.name,
      email: data.email,
      role: data.role,
    });
  }

  function setDataForUser(data: any) {
    setUser({
      uid: data.uid,
      access_token: data.access_token,
      username: data.name,
      session: data.session,
      role: data.role,
    });

    localStorage.setItem("user", JSON.stringify(data));

    setUserCookie(data);
  }

  function setUserCookie(data: any) {
    // 7 day expire
    const date = new Date();
    date.setTime(date.getTime() + 7 * 24 * 60 * 60 * 1000);
    document.cookie = `uid=${JSON.stringify(
      data.uid
    )}; expires=${date.toUTCString()}; path=/`;
    document.cookie = `access_token=${JSON.stringify(
      data.access_token
    )}; expires=${date.toUTCString()}; path=/`;
    document.cookie = `username=${JSON.stringify(
      data.username
    )}; expires=${date.toUTCString()}; path=/`;
    document.cookie = `email=${JSON.stringify(
      data.email
    )}; expires=${date.toUTCString()}; path=/`;
    document.cookie = `session=${JSON.stringify(
      data.session
    )}; expires=${date.toUTCString()}; path=/`;
    document.cookie = `name=${JSON.stringify(
      data.name
    )}; expires=${date.toUTCString()}; path=/`;
  }

  function raiseToast(title: string, status: string, message?: string) {
    toast({
      title: title,
      description: message || "",
      status: status as any,
      duration: 5000,
      isClosable: true,
      position: "bottom-left",
    });
  }

  const fetchUserDetails = React.useCallback(async () => {
    setLoading(true);
    try {
      let user = JSON.parse(localStorage.getItem("user") || "{}");

      if (user.Id === undefined) {
        user = {
          uid: JSON.parse(
            document.cookie.replace(
              /(?:(?:^|.*;\s*)uid\s*=\s*([^;]*).*$)|^.*$/,
              "$1"
            )
          ),
          access_token: JSON.parse(
            document.cookie.replace(
              /(?:(?:^|.*;\s*)access_token\s*=\s*([^;]*).*$)|^.*$/,
              "$1"
            )
          ),
          username: JSON.parse(
            document.cookie.replace(
              /(?:(?:^|.*;\s*)username\s*=\s*([^;]*).*$)|^.*$/,
              "$1"
            )
          ),
          Session: JSON.parse(
            document.cookie.replace(
              /(?:(?:^|.*;\s*)Session\s*=\s*([^;]*).*$)|^.*$/,
              "$1"
            )
          ),
          email: JSON.parse(
            document.cookie.replace(
              /(?:(?:^|.*;\s*)email\s*=\s*([^;]*).*$)|^.*$/,
              "$1"
            )
          ),
          session: JSON.parse(
            document.cookie.replace(
              /(?:(?:^|.*;\s*)session\s*=\s*([^;]*).*$)|^.*$/,
              "$1"
            )
          ),
          name: JSON.parse(
            document.cookie.replace(
              /(?:(?:^|.*;\s*)name\s*=\s*([^;]*).*$)|^.*$/,
              "$1"
            )
          ),
        };
      }

      if (
        user.uid === undefined ||
        user.uid === "" ||
        user.uid === null ||
        user.access_token === undefined ||
        user.access_token === "" ||
        user.access_token === null ||
        user.session === undefined ||
        user.session === "" ||
        user.session === null
      ) {
        notSignIn.current();
      }
      else {
        const currentUrl = window.location.pathname;
        if (currentUrl === "/sign-in" || currentUrl === "/" ) navigate("/sign-in");
        else navigate(currentUrl);
      }

      setDataForUser(user);
    } catch (err) {
      notSignIn.current();
    }


    notSignIn.current = ()=>{
      const currentUrl = window.location.pathname;
      if (currentUrl !== "/sign-in" && currentUrl !== "/password/forget" && !currentUrl.includes("/password/reset") ) navigate("/sign-in");
      else navigate(currentUrl);
      Logout();
      return;
    }

    setLoading(false);
  }, [setDataForUser,navigate]);



  function Logout() {
    document.cookie = "uid=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie =
      "access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie =
      "username=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "email=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie =
      "session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "name=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    localStorage.clear();
    sessionStorage.clear();
    setUser({
      username: "",
      session: "",
      access_token: "",
      uid: "",
      role: "",
    });
  }

  React.useEffect(() => {
    fetchUserDetails();
  }, []);

  return (
    <AppContext.Provider
      value={{
        setLoading,
        setData,
        setDataForUser,
        setUserCookie,
        fetchUserDetails,
        user,
        setUser,
        apiParams,
        setApiParams,
        raiseToast,
        show, setShow
      }}
    >
      {children}
      {loading && <Loading />}
    </AppContext.Provider>
  );
};

export default AppProvider;
