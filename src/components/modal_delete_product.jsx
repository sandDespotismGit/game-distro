import {
  Button,
  HStack,
  Modal,
  ModalContent,
  ModalOverlay,
  Text,
  useDisclosure,
  useToast,
  VStack,
} from "@chakra-ui/react";
import base_url from "../store/vars";
import { useStores } from "../store/store_context";
import { observer } from "mobx-react-lite";

const ModalDeleteProduct = observer(({ obj }) => {
  const { userStore, pageStore } = useStores();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const deleteProduct = async () => {
    const response = await fetch(`${base_url}/games/${obj?.id}`, {
      method: "DELETE",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${userStore.auth_token}`,
      },
    });
    if (response.ok) {
      toast({
        title: "Успех",
        description: "Игра удалена",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
      await pageStore.getAllGames();
    }
  };
  return (
    <>
      <Button
        onClick={onOpen}
        alignSelf={"center"}
        height={"40px"}
        border={"1px solid rgba(56, 72, 87, 1)"}
        bg={"rgba(26, 32, 40, 1)"}
        borderRadius={"100px"}
        padding={"0 16px"}
        _hover={{
          bg: "rgba(0, 84, 87, 1)",
          border: "1px solid rgba(112, 239, 222, 1)",
        }}
      >
        <Text
          color={"rgba(248, 250, 252, 1)"}
          fontSize={"16px"}
          fontWeight={"500"}
        >
          Delete
        </Text>
      </Button>

      <Modal
        blockScrollOnMount
        isOpen={isOpen}
        onClose={onClose}
        size={"2xl"}
        isCentered
        scrollBehavior={"inside"}
      >
        <ModalOverlay bg={"rgba(0,0,0,0.7)"} />
        <ModalContent
          padding={"20px"}
          borderRadius={"8px"}
          bg={"rgba(14, 18, 22, 1)"}
          border={"1px solid rgba(56, 72, 87, 1)"}
        >
          <VStack gap={0}>
            <Text
              color={"rgba(248, 250, 252, 1)"}
              fontWeight={"500"}
              fontSize={"18px"}
              position={"relative"}
            >
              Удалить игру?
            </Text>
            <HStack marginTop={"10px"}>
              <Button
                bg={"rgba(26, 32, 40, 1)"}
                border={"1px solid rgba(56, 72, 87, 1)"}
                _hover={{
                  bg: "rgba(0, 84, 87, 1)",
                }}
                onClick={onClose}
              >
                <Text
                  color={"rgba(248, 250, 252, 1)"}
                  fontSize={"16px"}
                  fontWeight={"500"}
                >
                  Нет
                </Text>
              </Button>
              <Button
                bg={"rgba(26, 32, 40, 1)"}
                border={"1px solid rgba(56, 72, 87, 1)"}
                _hover={{
                  bg: "rgba(0, 84, 87, 1)",
                }}
                onClick={async () => await deleteProduct()}
              >
                <Text
                  color={"rgba(248, 250, 252, 1)"}
                  fontSize={"16px"}
                  fontWeight={"500"}
                >
                  Да
                </Text>
              </Button>
            </HStack>
          </VStack>
        </ModalContent>
      </Modal>
    </>
  );
});

export default ModalDeleteProduct;
