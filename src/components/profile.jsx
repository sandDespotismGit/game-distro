import { Button, HStack, Image, Text, VStack } from "@chakra-ui/react";

import useWindowDimensions from "./windowDimensions";

import profileIcon from "./../images/profile.svg";
import profileActiveIcon from "./../images/active_profile.svg";
import closeWhiteIcon from "./../images/closw_icon_white.svg";
import { useNavigate } from "react-router-dom";
import { observer } from "mobx-react-lite";
import { useStores } from "../store/store_context";
import ModalIncreaseBalance from "./modal_increase_balance";
import Cookies from "js-cookie";

const Profile = observer(({ isBuy, router }) => {
  const { width, height } = useWindowDimensions();
  const navigate = useNavigate();
  const { pageStore, userStore } = useStores();

  return (
    <>
      <Image
        src={profileIcon}
        cursor={"pointer"}
        onClick={() => {
          pageStore.updateOpenProfile(!pageStore.is_open_profile);
          pageStore.updateOpenCart(false);
        }}
        onMouseOver={(e) => (e.currentTarget.src = profileActiveIcon)}
        onMouseOut={(e) => (e.currentTarget.src = profileIcon)}
      />
      <HStack
        bg={"rgba(0,0,0,0)"}
        position={"fixed"}
        top={
          !userStore.user_info?.is_seller && !isBuy && router == "purchase"
            ? "104px"
            : "40px"
        }
        overflow={"hidden"}
        right={0}
        width={pageStore.is_open_profile ? width : 0}
        transition={"width 0.3s ease"}
        zIndex={1000}
        align={"flex-start"}
        gap={0}
      >
        <VStack
          width={width > 600 ? "100%" : 0}
          minHeight={"100vh"}
          height={"auto"}
          onClick={() => pageStore.updateOpenProfile(false)}
        />
        <VStack
          width={
            pageStore.is_open_profile && width > 600
              ? "320px"
              : pageStore.is_open_profile && width <= 600
              ? width
              : 0
          }
          bg={"rgba(14, 18, 22, 1)"}
          transition={"width 0.3s ease"}
          minH={"100vh"}
          height={"auto"}
          borderLeft={
            pageStore.is_open_profile && width > 600
              ? "1px solid rgba(56, 72, 87, 1)"
              : null
          }
        >
          <VStack
            position={"relative"}
            width={"100%"}
            padding={"24px 16px"}
            opacity={pageStore.is_open_profile ? 1 : 0}
            transition={"opacity .3s ease"}
            height={"100%"}
            gap={0}
            align={"flex-start"}
          >
            <Text
              color={"rgba(248, 250, 252, 1)"}
              fontSize={"24px"}
              fontWeight={"600"}
              width={"max-content"}
              alignSelf={"center"}
            >
              Профиль
            </Text>
            <Image
              onClick={() => pageStore.updateOpenProfile(false)}
              src={closeWhiteIcon}
              position={"absolute"}
              right={"16px"}
              top={"16px"}
              visibility={pageStore.is_open_profile ? "visible" : "hidden"}
              cursor={"pointer"}
            />
            <HStack marginTop={"10px"} width={"100%"} justify={"center"}>
              <Button
                height={"40px"}
                border={"1px solid rgba(56, 72, 87, 1)"}
                bg={"rgba(26, 32, 40, 1)"}
                borderRadius={"100px"}
                padding={"0 16px"}
                _hover={{
                  bg: "rgba(0, 84, 87, 1)",
                  border: "1px solid rgba(112, 239, 222, 1)",
                }}
                onClick={() => {
                  pageStore.updateOpenProfile(false);
                  navigate("/purchase_history");
                }}
              >
                <Text
                  color={"rgba(248, 250, 252, 1)"}
                  fontSize={"16px"}
                  fontWeight={"500"}
                >
                  История покупок
                </Text>
              </Button>
              <Button
                height={"40px"}
                border={"1px solid rgba(56, 72, 87, 1)"}
                bg={"rgba(26, 32, 40, 1)"}
                borderRadius={"100px"}
                padding={"0 16px"}
                _hover={{
                  bg: "rgba(0, 84, 87, 1)",
                  border: "1px solid rgba(112, 239, 222, 1)",
                }}
                onClick={() => {
                  pageStore.updateOpenProfile(false);
                  navigate("/edit_profile");
                }}
              >
                <Text
                  color={"rgba(248, 250, 252, 1)"}
                  fontSize={"16px"}
                  fontWeight={"500"}
                >
                  Редактировать
                </Text>
              </Button>
            </HStack>

            <VStack
              width={"100%"}
              align={"flex-start"}
              gap={0}
              marginTop={"10px"}
              height={
                !userStore.user_info?.is_seller ? height - 300 : height - 250
              }
              border={"1px solid rgba(56, 72, 87, 1)"}
              padding={"10px"}
              borderRadius={"8px"}
              overflow={"hidden"}
              overflowY={"scroll"}
            >
              {!userStore.user_info?.is_seller && (
                <>
                  <Text
                    fontWeight={"600"}
                    color={"white"}
                    fontSize={"18px"}
                    width={"max-content"}
                  >
                    Баланс: {userStore.user_info?.balance} ₽
                  </Text>
                  <ModalIncreaseBalance />
                </>
              )}

              <VStack
                align={"flex-start"}
                gap={"0px"}
                marginTop={!userStore.user_info?.is_seller ? "10px" : "0px"}
              >
                <Text
                  color={"rgba(112, 239, 222, 1)"}
                  fontSize={"20px"}
                  fontWeight={"500"}
                  width={"max-content"}
                >
                  Псевдоним
                </Text>
                <Text
                  color={"rgba(248, 250, 252, 1)"}
                  fontSize={"16px"}
                  width={"max-content"}
                >
                  {userStore.user_info?.username}
                </Text>
              </VStack>
              <VStack align={"flex-start"} gap={"0px"} marginTop={"10px"}>
                <Text
                  color={"rgba(112, 239, 222, 1)"}
                  fontSize={"20px"}
                  fontWeight={"500"}
                  width={"max-content"}
                >
                  Имя
                </Text>
                <Text
                  color={"rgba(248, 250, 252, 1)"}
                  fontSize={"16px"}
                  width={"max-content"}
                >
                  {userStore.user_info?.firstname || "Не задано"}
                </Text>
              </VStack>
              <VStack align={"flex-start"} gap={"0px"}>
                <Text
                  color={"rgba(112, 239, 222, 1)"}
                  fontSize={"20px"}
                  fontWeight={"500"}
                  width={"max-content"}
                >
                  Фамилия
                </Text>
                <Text
                  color={"rgba(248, 250, 252, 1)"}
                  fontSize={"16px"}
                  width={"max-content"}
                >
                  {userStore.user_info?.lastname || "Не задано"}
                </Text>
              </VStack>
              <VStack align={"flex-start"} gap={"0px"} width={"max-content"}>
                <Text
                  color={"rgba(112, 239, 222, 1)"}
                  fontSize={"20px"}
                  fontWeight={"500"}
                  width={"max-content"}
                >
                  Номер телефона
                </Text>
                <Text
                  color={"rgba(248, 250, 252, 1)"}
                  fontSize={"16px"}
                  width={"max-content"}
                >
                  {userStore.user_info?.number || "Не задано"}
                </Text>
              </VStack>
              <VStack align={"flex-start"} gap={"0px"}>
                <Text
                  color={"rgba(112, 239, 222, 1)"}
                  fontSize={"20px"}
                  fontWeight={"500"}
                  width={"max-content"}
                >
                  Электронная почта
                </Text>
                <Text
                  color={"rgba(248, 250, 252, 1)"}
                  fontSize={"16px"}
                  width={"max-content"}
                >
                  {userStore.user_info?.email || "Не задано"}
                </Text>
              </VStack>
              <VStack align={"flex-start"} gap={"0px"} width={"100%"}>
                <Text
                  color={"rgba(112, 239, 222, 1)"}
                  fontSize={"20px"}
                  fontWeight={"500"}
                  width={"max-content"}
                >
                  Физический адрес
                </Text>
                <Text
                  color={"rgba(248, 250, 252, 1)"}
                  fontSize={"16px"}
                  width={"max-content"}
                  maxWidth={"100%"}
                  whiteSpace={"nowrap"}
                  textOverflow={"ellipsis"}
                  overflow={"hidden"}
                >
                  {userStore.user_info?.address || "Не задано"}
                </Text>
              </VStack>
            </VStack>
            <Button
              marginTop={"10px"}
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
              onClick={() => {
                pageStore.updateOpenProfile(false);
                userStore.resetUser();
                pageStore.resetFilters();
                navigate("/auth");
                Cookies.remove("auth_token");
              }}
            >
              <Text
                color={"rgba(248, 250, 252, 1)"}
                fontSize={"16px"}
                fontWeight={"500"}
              >
                Выйти
              </Text>
            </Button>
          </VStack>
        </VStack>
      </HStack>
    </>
  );
});

export default Profile;
