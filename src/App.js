import { createHashRouter, RouterProvider } from "react-router-dom";
import { ChakraProvider } from "@chakra-ui/react";

import RootStore from "./store/root_store";
import { RootStoreContext } from "./store/store_context";

import MainPage from "./pages/main_page";
import AuthPage from "./pages/auth_page";
import BioPage from "./pages/bio_page";
import theme from "./theme";
import EditProfilePage from "./pages/edit_profile_page";
import BuyPage from "./pages/buy_page";
import RecomendationPage from "./pages/recomedenation_page";
import PurchaseHistoryPage from "./pages/purchase_history_page";

const router = createHashRouter([
  {
    path: "/",
    element: <MainPage />,
  },
  {
    path: "/auth",
    element: <AuthPage />,
  },
  {
    path: "/bio",
    element: <BioPage />,
  },
  {
    path: "/edit_profile",
    element: <EditProfilePage />,
  },
  {
    path: "/buy",
    element: <BuyPage />,
  },
  {
    path: "/recomendation",
    element: <RecomendationPage />,
  },
  {
    path: "/purchase_history",
    element: <PurchaseHistoryPage />,
  },
]);

function App() {
  return (
    <RootStoreContext.Provider value={new RootStore()}>
      <ChakraProvider theme={theme}>
        <RouterProvider router={router} />
      </ChakraProvider>
    </RootStoreContext.Provider>
  );
}

export default App;
