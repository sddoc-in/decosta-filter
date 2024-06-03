import { Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Loading from "./components/loader/Loading";
import Signin from "./pages/Signin";
import AppProvider from "./context/Context";
import { SidebarData } from "./constants/Sidebar";
import GlobalLayout from "./components/dashboard/GlobalLayout";
// import { UserOptions } from "./constants/Users";
import WrongUrl from "./pages/WrongUrl";
import { ChakraProvider } from "@chakra-ui/react";
import ContextProvider from "./context/ContextProvider";
import Results from "./pages/Results";

function App() {
  return (
    <>
      <ChakraProvider>
        <Router />
      </ChakraProvider>
    </>
  );
}

function Router() {
  // const { user: currentUser } = React.useContext(AppContext);
  return (
    <>
      <BrowserRouter>
        <Suspense fallback={<Loading />}>
          <Routes>
            <Route
              path="/"
              element={<ContextProvider children={<Signin />} />}
            />
            <Route
              path="/sign-in"
              element={<ContextProvider children={<Signin />} />}
            />

            <Route
              path="/wrong-url"
              element={<ContextProvider children={<WrongUrl />} />}
            />

            <Route
              path="/dashboard/results/:id"
              element={
                <ContextProvider
                  children={
                    <GlobalLayout>
                      <Results />
                    </GlobalLayout>
                  }
                />
              }
            />

            {SidebarData.map((item, index) => {
              // if (item.title === "Users" && currentUser.role !== "admin")
              //   return null;
              return (
                <Route
                  key={index}
                  path={item.path}
                  element={
                    <ContextProvider
                      children={
                        <GlobalLayout>
                          <item.Element />
                        </GlobalLayout>
                      }
                    />
                  }
                />
              );
            })}
          </Routes>
        </Suspense>
      </BrowserRouter>
    </>
  );
}

export default App;
