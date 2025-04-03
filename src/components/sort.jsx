import {
  HStack,
  Image,
  Modal,
  ModalContent,
  ModalOverlay,
  Stack,
  Text,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";

import useWindowDimensions from "./windowDimensions";

import sortIcon from "./../images/sort_icon.svg";
import { useStores } from "../store/store_context";
import { observer } from "mobx-react-lite";

const Sort = observer(() => {
  const { width } = useWindowDimensions();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { pageStore } = useStores();
  return (
    <>
      <HStack
        cursor={"pointer"}
        height={"40px"}
        gap={"8px"}
        padding={"0 16px"}
        border={"1px solid rgba(56, 72, 87, 1)"}
        borderRadius={"8px"}
        width={"fit-content"}
        flexShrink={0}
        _hover={{
          bgColor: "rgba(0, 84, 87, 1)",
          border: "1px solid rgba(112, 239, 222, 1)",
        }}
        transition={"background-color 0.3s ease, border 0.3s ease"}
        onClick={onOpen}
      >
        <Image src={sortIcon} />
        {width >= 760 && (
          <Text
            color={"rgba(248, 250, 252, 1)"}
            fontSize={"16px"}
            fontWeight={"500"}
            minWidth={"max-content"}
          >
            Сортировка
          </Text>
        )}
      </HStack>
      <Modal isOpen={isOpen} onClose={onClose} size={"2xl"} isCentered>
        <ModalOverlay bg={"rgba(0,0,0,0.7)"} />
        <ModalContent
          padding={"20px"}
          borderRadius={"8px"}
          bg={"rgba(14, 18, 22, 1)"}
          border={"1px solid rgba(56, 72, 87, 1)"}
          alignItems={"center"}
          width={"100%"}
        >
          <VStack color={"rgba(248, 250, 252, 1)"}>
            <Stack
              align={"center"}
              justify={"center"}
              height={"30px"}
              bg={pageStore.sort[0] == 1 ? "rgba(0, 84, 87, 0.6)" : null}
              border={
                pageStore.sort[0] == 1
                  ? "1px solid rgba(112, 239, 222, 1)"
                  : "1px solid rgba(56, 72, 87, 1)"
              }
              width={"200px"}
              borderRadius={"8px"}
              _hover={{
                bgColor: "rgba(0, 84, 87, 0.6)",
                border: "1px solid rgba(112, 239, 222, 1)",
              }}
              transition={"background-color 0.3s ease, border 0.3s ease"}
              onClick={() => {
                onClose();
                pageStore.updateSort([1, 0, 0, 0]);
              }}
            >
              <Text>По алфавиту (А-Я)</Text>
            </Stack>
            <Stack
              align={"center"}
              justify={"center"}
              height={"30px"}
              bg={pageStore.sort[1] == 1 ? "rgba(0, 84, 87, 0.6)" : null}
              border={
                pageStore.sort[1] == 1
                  ? "1px solid rgba(112, 239, 222, 1)"
                  : "1px solid rgba(56, 72, 87, 1)"
              }
              width={"200px"}
              borderRadius={"8px"}
              cursor={"pointer"}
              _hover={{
                bgColor: "rgba(0, 84, 87, 0.6)",
                border: "1px solid rgba(112, 239, 222, 1)",
              }}
              transition={"background-color 0.3s ease, border 0.3s ease"}
              onClick={() => {
                onClose();
                pageStore.updateSort([0, 1, 0, 0]);
              }}
            >
              <Text>По алфавиту (Я-А)</Text>
            </Stack>
            <Stack
              align={"center"}
              justify={"center"}
              height={"30px"}
              bg={pageStore.sort[2] == 1 ? "rgba(0, 84, 87, 0.6)" : null}
              border={
                pageStore.sort[2] == 1
                  ? "1px solid rgba(112, 239, 222, 1)"
                  : "1px solid rgba(56, 72, 87, 1)"
              }
              width={"200px"}
              borderRadius={"8px"}
              cursor={"pointer"}
              _hover={{
                bgColor: "rgba(0, 84, 87, 0.6)",
                border: "1px solid rgba(112, 239, 222, 1)",
              }}
              transition={"background-color 0.3s ease, border 0.3s ease"}
              onClick={() => {
                onClose();
                pageStore.updateSort([0, 0, 1, 0]);
              }}
            >
              <Text>По цене (дешевле)</Text>
            </Stack>
            <Stack
              align={"center"}
              justify={"center"}
              height={"30px"}
              bg={pageStore.sort[3] == 1 ? "rgba(0, 84, 87, 0.6)" : null}
              border={
                pageStore.sort[3] == 1
                  ? "1px solid rgba(112, 239, 222, 1)"
                  : "1px solid rgba(56, 72, 87, 1)"
              }
              width={"200px"}
              borderRadius={"8px"}
              cursor={"pointer"}
              _hover={{
                bgColor: "rgba(0, 84, 87, 0.6)",
                border: "1px solid rgba(112, 239, 222, 1)",
              }}
              transition={"background-color 0.3s ease, border 0.3s ease"}
              onClick={() => {
                onClose();
                pageStore.updateSort([0, 0, 0, 1]);
              }}
            >
              <Text>По цене (дороже)</Text>
            </Stack>
          </VStack>
        </ModalContent>
      </Modal>
    </>
  );
});

export default Sort;
