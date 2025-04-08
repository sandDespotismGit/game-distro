import {
  Button,
  HStack,
  Image,
  Modal,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  Stack,
  Text,
  useToast,
  VStack,
} from "@chakra-ui/react";

import useWindowDimensions from "./windowDimensions";

import macIcon from "./../images/apple_icon.svg";
import windowIcon from "./../images/windows_icon.svg";
import { observer } from "mobx-react-lite";
import { useStores } from "../store/store_context";
import base_url from "../store/vars";
import downloadIcon from "./../images/download.svg";

const ModalProductCard = observer(({ isOpen, onOpen, onClose, obj = {} }) => {
  const { width } = useWindowDimensions();
  const { userStore } = useStores();
  const toast = useToast();

  const addToCart = async (id) => {
    return await userStore.addToCart(id);
  };

  const deleteToCart = async () => {
    const response = await fetch(`${base_url}/games/cart/${obj?.id}`, {
      method: "DELETE",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${userStore.auth_token}`,
      },
    });
    if (response.ok) {
      await userStore.getCart(userStore?.auth_token);
    }
    return response.ok;
  };

  const isInCart = userStore.cart.some((item) => item?.id == obj?.id);

  // для незарегистрированного пользователя
  const handleToTempCart = () => {
    let newCart;

    if (isInCart) {
      newCart = userStore.cart?.filter((item) => item?.id != obj?.id);
      toast({
        title: "Товар удален из корзины",
        status: "info",
        duration: 2000,
        isClosable: true,
      });
      userStore.updateCart(newCart);
    } else {
      newCart = [...userStore.cart, obj];
      toast({
        title: "Товар добавлен в корзину",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
      userStore.updateCart(newCart);
    }
  };

  const handleCart = async () => {
    if (isInCart) {
      const ok = await deleteToCart();
      if (ok) {
        toast({
          title: "Товар удален из корзины",
          status: "info",
          duration: 2000,
          isClosable: true,
        });
      } else {
        toast({
          title: "Ошибка при удалении из корзины",
          status: "error",
          duration: 2000,
          isClosable: true,
        });
      }
    } else {
      const ok = await addToCart(obj?.id);
      if (ok) {
        toast({
          title: "Товар добавлен в корзину",
          status: "success",
          duration: 2000,
          isClosable: true,
        });
      }
    }
  };

  const handleDownload = () => {
    window.open(`http://212.41.9.251:8013/${obj?.bin_url}`, "_blank");
  };

  return (
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
        height={"500px"}
        overflow={"hidden"}
        overflowY={"scroll"}
      >
        <ModalCloseButton color={"rgba(248, 250, 252, 1)"} />
        <VStack marginTop={"30px"} gap={0}>
          <Image
            src={`http://212.41.9.251:8013/${obj?.picture_url}`}
            borderRadius={"8px"}
          />
          <Stack
            width={"100%"}
            flexDirection={width >= 600 ? "row" : "column"}
            justify={width >= 600 ? "space-between" : null}
            align={"flex-start"}
          >
            <VStack gap={0} width={"100%"}>
              <Text
                color={"rgba(248, 250, 252, 1)"}
                fontWeight={"600"}
                fontSize={"20px"}
                marginTop={"10px"}
                width={"100%"}
              >
                {obj?.name}
              </Text>
              <Text
                color={"rgba(248, 250, 252, 1)"}
                fontSize={"16px"}
                // marginTop={"8px"}
                width={"100%"}
              >
                Дата выхода: {new Date(obj?.date).toLocaleDateString()}
              </Text>
            </VStack>

            <HStack
              marginTop={"10px"}
              padding={"0"}
              border={"1px solid rgba(56, 72, 87, 1)"}
              borderRadius={"8px"}
              width={"100%"}
              justify={"space-between"}
            >
              <HStack marginLeft={"20px"}>
                <Text
                  textDecoration={
                    obj?.price == "0" || obj?.discount == "0"
                      ? "none"
                      : "line-through"
                  }
                  color={
                    obj?.price == "0"
                      ? "rgba(248, 250, 252, 1)"
                      : "rgba(0, 84, 87, 1)"
                  }
                >
                  {obj?.price == "0" ? "Free" : `${obj?.price} ₽`}
                </Text>
                {obj?.price == "0" || obj?.discount == "0" ? null : (
                  <Text color={"rgba(248, 250, 252, 1)"}>
                    {parseInt(Number(obj?.price * (1 - obj?.discount / 100)))} ₽
                  </Text>
                )}
              </HStack>
              <Button
                borderLeft={"1px solid rgba(56, 72, 87, 1)"}
                borderRadius={"8px"}
                bg={"rgba(26, 32, 40, 1)"}
                _hover={{
                  bgColor: "rgba(0, 84, 87, 1)",
                }}
                height={"60px"}
                padding={"0 10px"}
                width={"40%"}
                onClick={async () =>
                  userStore.boughts?.find((item) => item?.id == obj?.id)
                    ? handleDownload()
                    : userStore.auth_token
                    ? await handleCart()
                    : handleToTempCart()
                }
              >
                <Text color={"rgba(248, 250, 252, 1)"} fontWeight={"500"}>
                  {userStore.boughts?.find((item) => item?.id == obj.id)
                    ? "Скачать"
                    : isInCart
                    ? "Убрать"
                    : "В корзину"}
                </Text>
              </Button>
            </HStack>
          </Stack>
          <HStack
            marginTop={"8px"}
            width={"100%"}
            justify={"flex-start"}
            align={"center"}
            gap={"6px"}
            overflow={"hidden"}
            overflowX={"scroll"}
            padding={"10px 0"}
          >
            {obj?.genre?.split(",")?.map((item, index) => {
              return (
                <Stack
                  key={index}
                  border={"1px solid rgba(50, 139, 255, 1)"}
                  bg={"rgba(14, 18, 22, 1)"}
                  borderRadius={"100px"}
                  height={"40px"}
                  padding={"0 10px"}
                  justify={"center"}
                  align={"center"}
                >
                  <Text
                    color={"rgba(50, 139, 255, 1)"}
                    fontSize={"14px"}
                    fontWeight={"500"}
                    width={"max-content"}
                  >
                    {item}
                  </Text>
                </Stack>
              );
            })}
          </HStack>
          <HStack
            width={"100%"}
            justify={"flex-start"}
            align={"center"}
            gap={"6px"}
            overflow={"hidden"}
            overflowX={"scroll"}
            padding={"10px 0"}
          >
            {obj?.platforms?.split(",")?.map((item, index) => (
              <Image
                src={item == "windows" ? windowIcon : macIcon}
                key={index}
              />
            ))}
          </HStack>
          <Text
            color={"rgba(248, 250, 252, 1)"}
            fontWeight={"600"}
            fontSize={"20px"}
            marginTop={"10px"}
            w={"100%"}
          >
            Описание
          </Text>
          <Text
            marginTop={"10px"}
            color={"rgba(248, 250, 252, 1)"}
            fontSize={"16px"}
            fontWeight={"400"}
            width={"100%"}
          >
            {obj?.description}
          </Text>
        </VStack>
      </ModalContent>
    </Modal>
  );
});

export default ModalProductCard;
