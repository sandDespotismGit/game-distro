import {
  HStack,
  Image,
  Stack,
  Text,
  useDisclosure,
  useToast,
  VStack,
} from "@chakra-ui/react";

import useWindowDimensions from "./windowDimensions";

import windowsIcon from "./../images/windows_icon.svg";
import appleIcon from "./../images/apple_icon.svg";
import cartIcon from "./../images/Cart.svg";
import activeCartIcon from "./../images/active_cart.svg";
import ModalProductCard from "./modal_product_card";

import { observer } from "mobx-react-lite";
import { useStores } from "../store/store_context";
import base_url from "../store/vars";
import { useState } from "react";

const ProductCard = observer(({ obj = {} }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { pageStore, userStore } = useStores();
  const toast = useToast();

  const { width } = useWindowDimensions();

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
      await userStore.getCart();
    }
    return response.ok;
  };

  const isInCart = userStore.cart.some((item) => item?.id == obj?.id);

  // для незарегистрированного пользователя
  const handleToTempCart = () => {
    let newCart;

    if (isInCart) {
      newCart = userStore.cart.filter((item) => item?.id != obj?.id);
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

  return (
    <>
      <VStack
        padding={
          width >= 1400 ? "20px 16px" : ["14px 8px", "18px 12px", "20px 16px"]
        }
        height={width >= 1440 ? "318px" : ["300px", "310px", "318px"]}
        bg={"rgba(26, 32, 40, 1)"}
        border={"1px solid rgba(56, 72, 87, 1)"}
        borderRadius={"8px"}
        align={"flex-start"}
        gap={0}
        width={width >= 1200 ? "276px" : width >= 715 ? "225px" : "170px"}
        spacing={0}
        _hover={{
          bgColor: "rgba(0, 84, 87, 0.6)",
          border: "1px solid rgba(112, 239, 222, 1)",
        }}
        transition={"background-color 0.3s ease, border 0.3s ease"}
      >
        <VStack
          gap={0}
          align={"flex-start"}
          w={"100%"}
          cursor={"pointer"}
          onClick={onOpen}
        >
          <Image
            src={`http://localhost:8000/${obj?.picture_url}`}
            height={"134px"}
          />
          <HStack
            width={"100%"}
            justify={"flex-start"}
            align={"center"}
            gap={"6px"}
            overflow={"hidden"}
            overflowX={"scroll"}
            padding={"10px 0"}
          >
            {obj?.genre.split(",").map((item, index) => (
              <Stack
                key={index}
                border={"1px solid rgba(50, 139, 255, 1)"}
                bg={
                  item == "Новинка"
                    ? "linear-gradient(90deg, #86A3DA 0%, #96F5F3 100%)"
                    : "rgba(14, 18, 22, 1)"
                }
                borderRadius={"100px"}
                height={"20px"}
                padding={"0 8px"}
                justify={"center"}
                align={"center"}
                gap={0}
              >
                <Text
                  color={
                    item == "Новинка"
                      ? "rgba(14, 18, 22, 1)"
                      : "rgba(50, 139, 255, 1)"
                  }
                  fontSize={"12px"}
                  fontWeight={"500"}
                  width={"max-content"}
                >
                  {item}
                </Text>
              </Stack>
            ))}
          </HStack>

          <HStack justify={"space-between"} w={"100%"} marginTop={"2px"}>
            <Text
              color={"rgba(248, 250, 252, 1)"}
              fontSize={width >= 1440 ? "20px" : ["16px", "18px", "20px "]}
              fontWeight={"600"}
              cursor={"pointer"}
              whiteSpace={"nowrap"}
              textOverflow={"ellipsis"}
              overflow={"hidden"}
              maxWidth={width >= 1440 ? "174px" : ["100px", "140px", "160px"]}
            >
              {obj?.name}
            </Text>
            <HStack gap={"4px"}>
              {obj?.platforms.split(",").map((item, index) => (
                <Image
                  key={index}
                  src={item == "windows" ? windowsIcon : appleIcon}
                  w={width >= 1440 ? "auto" : ["20px"]}
                />
              ))}
            </HStack>
          </HStack>
          <Text
            color={"rgba(248, 250, 252, 1)"}
            fontSize={width >= 1440 ? "16px" : ["12px", "14px", "16px"]}
            marginTop={"2px"}
          >
            {new Date(obj?.date).toLocaleDateString()}
          </Text>
        </VStack>

        <HStack width={"100%"} justify={"space-between"} marginTop={"12px"}>
          <HStack justify={"flex-start"} gap={"8px"} align={"center"}>
            <Text
              fontSize={width >= 1440 ? "20px" : ["14px", "14px", "20px"]}
              fontWeight={"600"}
              color={
                obj?.price == "0"
                  ? "rgba(112, 239, 222, 1)"
                  : "rgba(248, 250, 252, 1)"
              }
              textDecoration={obj?.price == "0" ? "none" : "line-through"}
            >
              {obj?.price == "0" ? "Бесплатно" : `${obj?.price} ₽`}
            </Text>
            {obj?.price == "0" || userStore.boughts.length != 0 ? null : (
              <Stack
                // height={"28px"}
                borderRadius={"100px"}
                border={"1px solid rgba(50, 139, 255, 1)"}
                background={"linear-gradient(90deg, #86A3DA 0%, #96F5F3 100%)"}
                color={"rgba(14, 18, 22, 1)"}
                padding={"2px 8px"}
                align={"center"}
                justify={"center"}
              >
                <Text
                  fontSize={width >= 1440 ? "20px" : ["14px", "14px", "20px"]}
                  fontWeight={"600"}
                  lineHeight={"24px"}
                >
                  {parseInt(Number(obj?.price * 0.95))} ₽
                </Text>
              </Stack>
            )}
          </HStack>

          <Image
            src={isInCart ? activeCartIcon : cartIcon}
            zIndex={10}
            cursor={"pointer"}
            onClick={async () =>
              userStore.auth_token ? await handleCart() : handleToTempCart()
            }
          />
        </HStack>
      </VStack>
      <ModalProductCard
        obj={obj}
        isOpen={isOpen}
        onOpen={() => onOpen()}
        onClose={() => onClose()}
      />
    </>
  );
});

export default ProductCard;
