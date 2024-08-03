import { Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Loading from "./components/loader/Loading";
import Signin from "./pages/Signin";
import { FormWithDataRoutes, SidebarData } from "./constants/Sidebar";
import GlobalLayout from "./components/dashboard/GlobalLayout";
import WrongUrl from "./pages/WrongUrl";
import { ChakraProvider } from "@chakra-ui/react";
import ContextProvider from "./context/ContextProvider";
import Results from "./pages/Results";
import PassReset from "./pages/PassReset";
import ForgetPass from "./pages/ForgetPass";
import ProfilePage from "./pages/ProfilePage";

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
              path="/password/reset/:email/:uid"
              element={
                <ContextProvider
                  children={
                    <PassReset />
                  }
                />
              }
            />
             <Route
              path="/password/forget"
              element={
                <ContextProvider
                  children={
                    <ForgetPass />
                  }
                />
              }
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
            <Route
              path="/profile"
              element={
                <ContextProvider>
                  <ProfilePage />
                </ContextProvider>
              }
            />

            {SidebarData.map((item, index) => {
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

            {FormWithDataRoutes.map((item, index) => {
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
