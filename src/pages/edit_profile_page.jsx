import { Stack, VStack } from "@chakra-ui/react";

import Header from "../components/header";
import EditForm from "../components/forms/edit_form";
import { observer } from "mobx-react-lite";

const EditProfilePage = observer(() => {
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
        <EditForm />
      </Stack>
    </VStack>
  );
});

export default EditProfilePage;
