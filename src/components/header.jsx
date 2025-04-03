import { HStack, Image, Text, VStack } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

import useWindowDimensions from "./windowDimensions";
import Profile from "./profile";
import Cart from "./cart";

import logo from "./../images/logo.svg";
import { observer } from "mobx-react-lite";
import { useStores } from "../store/store_context";

const Header = observer(({ router, isBuy }) => {
  const [selected, setSelected] = useState([1, 0, 0, 0]);

  const navigate = useNavigate();
  const { width } = useWindowDimensions();
  const { pageStore, userStore } = useStores();

  return (
    <VStack width={"100%"} gap={0} position={"fixed"} zIndex={1000}>
      <HStack
        background={"rgba(14, 18, 22, 1)"}
        width={"100%"}
        justify={"space-between"}
        padding={"8px 32px"}
        borderBottom={
          userStore.user_info?.is_seller && router != "login"
            ? "1px solid rgba(56, 72, 87, 1)"
            : null
        }
      >
        <Image
          src={logo}
          cursor={"pointer"}
          onClick={() => {
            navigate("/");
            pageStore.updateOpenProfile(false);
            pageStore.updateOpenCart(false);
          }}
        />
        {router != "login" ? (
          <HStack gap={"16px"}>
            {!userStore.user_info?.is_seller && <Cart isBuy={isBuy} />}
            {userStore.auth_token != "" && <Profile isBuy={isBuy} />}

            {userStore.auth_token == "" && (
              <Text
                color={"rgba(248, 250, 252, 1)"}
                fontSize={"14px"}
                fontWeight={"500"}
                cursor={"pointer"}
                _hover={{
                  textDecoration: "underline",
                }}
                onClick={() => navigate("/auth")}
              >
                Вход/регистрация
              </Text>
            )}
          </HStack>
        ) : null}
      </HStack>
      {router != "login" &&
      router != "profile" &&
      !userStore.user_info?.is_seller &&
      router != "buy" ? (
        <HStack
          background={"rgba(26, 32, 40, 1)"}
          height={"64px"}
          overflow={"hidden"}
          overflowX={"scroll"}
          padding={"0 10px"}
          width={"100%"}
          fontSize={
            width >= 1440 ? "24px" : ["12px", "14px", "18px", "20px", "22px"]
          }
          fontWeight={"600"}
          spacing={0}
          gap={
            width >= 1440 ? "125px" : ["15px", "25px", "30px", "45px", "60px"]
          }
          justify={"center"}
          borderBottom={"1px solid rgba(56, 72, 87, 1)"}
          borderBottomEndRadius={"6px"}
          borderBottomStartRadius={"6px"}
          onClick={() => {
            pageStore.updateOpenProfile(false);
            pageStore.updateOpenCart(false);
          }}
        >
          <Text
            cursor={"pointer"}
            color={
              selected[0] == 1
                ? "rgba(112, 239, 222, 1)"
                : "rgba(248, 250, 252, 1)"
            }
            _hover={{
              color: "rgba(112, 239, 222, 1)",
            }}
            transition={"color 0.2s ease"}
            onClick={() => setSelected([1, 0, 0, 0])}
          >
            Каталог
          </Text>
          <Text
            cursor={"pointer"}
            color={
              selected[1] == 1
                ? "rgba(112, 239, 222, 1)"
                : "rgba(248, 250, 252, 1)"
            }
            _hover={{
              color: "rgba(112, 239, 222, 1)",
            }}
            transition={"color 0.2s ease"}
            onClick={() => setSelected([0, 1, 0, 0])}
          >
            Рекомендации
          </Text>
          <Text
            cursor={"pointer"}
            color={
              selected[2] == 1
                ? "rgba(112, 239, 222, 1)"
                : "rgba(248, 250, 252, 1)"
            }
            _hover={{
              color: "rgba(112, 239, 222, 1)",
            }}
            transition={"color 0.2s ease"}
            onClick={() => setSelected([0, 0, 1, 0])}
          >
            Условия возврата
          </Text>
          <Text
            cursor={"pointer"}
            color={
              selected[3] == 1
                ? "rgba(112, 239, 222, 1)"
                : "rgba(248, 250, 252, 1)"
            }
            _hover={{
              color: "rgba(112, 239, 222, 1)",
            }}
            transition={"color 0.2s ease"}
            onClick={() => setSelected([0, 0, 0, 1])}
          >
            Контакты
          </Text>
        </HStack>
      ) : null}
    </VStack>
  );
});

export default Header;
