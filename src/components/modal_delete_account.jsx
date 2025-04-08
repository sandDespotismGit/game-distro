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

import base_url from "./../store/vars";
import { useState } from "react";
import { useStores } from "../store/store_context";
import { useNavigate } from "react-router-dom";
import { observer } from "mobx-react-lite";

const ModalDeleteAccount = observer(() => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { userStore } = useStores();
  const navigate = useNavigate();

  const toast = useToast();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const deleteMe = async () => {
    const response = await fetch(`${base_url}/me`, {
      method: "DELETE",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${userStore.auth_token}`,
      },
    });
    if (response.ok) {
      setIsSubmitting(true);
      toast({
        title: "Успех",
        description: "Аккаунт удален",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
      setIsSubmitting(false);
      userStore.resetUser();
      navigate("/");
    }
  };
  return (
    <>
      <Button
        onClick={onOpen}
        bg={"rgba(26, 32, 40, 1)"}
        border={"1px solid rgba(56, 72, 87, 1)"}
        _hover={{
          bg: "rgba(0, 84, 87, 1)",
        }}
      >
        <Text color={"red"} fontSize={"16px"} fontWeight={"500"}>
          Удалить аккаунт
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
              Удалить аккаунт?
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
                onClick={async () => await deleteMe()}
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

export default ModalDeleteAccount;
