import { Stack, VStack } from "@chakra-ui/react";

import Header from "../components/header";
import BioForm from "../components/forms/bio_form";

const BioPage = () => {
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
        <BioForm />
      </Stack>
    </VStack>
  );
};

export default BioPage;
