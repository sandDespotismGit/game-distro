import { Stack, VStack } from "@chakra-ui/react";

import Header from "../components/header";
import AuthForm from "../components/forms/auth_form";
import { observer } from "mobx-react-lite";

const AuthPage = observer(() => {
  return (
    <VStack
      width={"100%"}
      minHeight={"100vh"}
      background={"rgba(18, 18, 18, 1)"}
      margin={0}
      padding={0}
      spacing={0}
    >
      <Header router={"login"} />
      <Stack margin={"auto"}>
        <AuthForm />
      </Stack>
    </VStack>
  );
});

export default AuthPage;
