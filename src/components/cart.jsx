import {
  Button,
  Grid,
  GridItem,
  HStack,
  Image,
  Text,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { useEffect } from "react";

import useWindowDimensions from "./windowDimensions";

import cartIcon from "./../images/Cart.svg";
import cartActiveIcon from "./../images/active_cart.svg";
import closeWhiteIcon from "./../images/closw_icon_white.svg";
import CartProductCard from "./cart_product_card";
import { observer } from "mobx-react-lite";
import { useStores } from "../store/store_context";
import { useNavigate } from "react-router-dom";

const Cart = observer(({ isBuy, router }) => {
  const navigate = useNavigate();

  const { width, height } = useWindowDimensions();
  const { pageStore, userStore } = useStores();
  const toast = useToast();

  const getSumCartDiscount = () => {
    const sumCartDiscount = userStore.cart.reduce(
      (sum, obj) =>
        sum + Number(obj?.price) * (1 - Number(obj?.discount) / 100),
      0
    );
    return sumCartDiscount;
  };

  const getSumCart = () => {
    const sumCart = userStore.cart.reduce(
      (sum, obj) => sum + Number(obj?.price),
      0
    );
    return sumCart;
  };

  useEffect(() => {
    pageStore.updateSumCart(getSumCart());
    pageStore.updateSumCartWithDiscount(getSumCartDiscount());
  }, [userStore.cart]);

  return (
    <>
      <Image
        src={cartIcon}
        cursor={"pointer"}
        onMouseOver={(e) => (e.currentTarget.src = cartActiveIcon)}
        onMouseOut={(e) => (e.currentTarget.src = cartIcon)}
        onClick={() => {
          pageStore.updateOpenCart(!pageStore.is_open_cart);
          pageStore.updateOpenProfile(false);
        }}
      />
      <HStack
        bg={"rgba(0,0,0,0)"}
        position={"fixed"}
        top={!isBuy && router == "purchase" ? "104px" : "40px"}
        overflow={"hidden"}
        right={0}
        width={pageStore.is_open_cart ? width : 0}
        transition={"width 0.3s ease"}
        zIndex={1000}
        align={"flex-start"}
        gap={0}
      >
        <VStack
          width={width > 600 ? "100%" : 0}
          minHeight={"100vh"}
          height={"auto"}
          onClick={() => pageStore.updateOpenCart(false)}
        />
        <VStack
          width={
            pageStore.is_open_cart && width > 600
              ? "400px"
              : pageStore.is_open_cart && width <= 600
              ? width
              : 0
          }
          bg={"rgba(14, 18, 22, 1)"}
          transition={"width 0.3s ease"}
          minH={"100vh"}
          height={"auto"}
          borderLeft={
            pageStore.is_open_cart && width > 600
              ? "1px solid rgba(56, 72, 87, 1)"
              : null
          }
        >
          <VStack
            position={"relative"}
            width={"100%"}
            padding={"24px 16px"}
            opacity={pageStore.is_open_cart ? 1 : 0}
            transition={"opacity .3s ease"}
            height={"100%"}
            gap={0}
            align={"flex-start"}
            justify={"flex-start"}
          >
            <Text
              color={"rgba(248, 250, 252, 1)"}
              fontSize={"24px"}
              fontWeight={"600"}
              width={"max-content"}
              alignSelf={"center"}
            >
              Корзина
            </Text>
            <Image
              onClick={() => pageStore.updateOpenCart(false)}
              src={closeWhiteIcon}
              position={"absolute"}
              right={"16px"}
              top={"16px"}
              visibility={pageStore.is_open_cart ? "visible" : "hidden"}
              cursor={"pointer"}
            />
            {userStore.cart?.length != 0 ? (
              <>
                <Button
                  alignSelf={"center"}
                  height={"40px"}
                  border={"1px solid rgba(56, 72, 87, 1)"}
                  bg={"rgba(26, 32, 40, 1)"}
                  borderRadius={"100px"}
                  marginTop={"10px"}
                  padding={"0 16px"}
                  _hover={{
                    bg: "rgba(0, 84, 87, 1)",
                    border: "1px solid rgba(112, 239, 222, 1)",
                  }}
                  onClick={() => {
                    if (userStore.auth_token) {
                      navigate("/buy");
                      pageStore.updateOpenCart(false);
                    } else {
                      toast({
                        description: "Войдите в аккаунт, чтобы сделать покупку",
                        status: "error",
                        duration: "2000",
                        isClosable: true,
                      });
                    }
                  }}
                >
                  <Text
                    color={"rgba(248, 250, 252, 1)"}
                    fontSize={"16px"}
                    fontWeight={"500"}
                  >
                    К оформлению
                  </Text>
                </Button>
                <Text color={"white"} marginTop={"10px"} width={"max-content"}>
                  Сумма без учета скидок: {pageStore.sum_cart} ₽
                </Text>
                <Text color={"white"} marginTop={"4px"} width={"max-content"}>
                  Сумма с учетом скидок: {pageStore.sum_cart_discount} ₽
                </Text>
                {userStore?.boughts > 0 && (
                  <Text
                    color={"white"}
                    marginTop={"4px"}
                    width={"max-content"}
                    fontWeight={"600"}
                  >
                    Итого: {pageStore.sum_cart_discount} ₽
                  </Text>
                )}

                {userStore.boughts.length > 0 ? null : (
                  <>
                    <Text
                      color={"white"}
                      marginTop={"4px"}
                      width={"max-content"}
                    >
                      Скидка новому пользователю: 5%
                    </Text>
                    <Text
                      color={"white"}
                      marginTop={"4px"}
                      width={"max-content"}
                      fontWeight={"600"}
                    >
                      Итого: {parseInt(pageStore.sum_cart_discount * 0.95)} ₽
                    </Text>
                  </>
                )}

                <Grid
                  gridTemplateColumns={"1fr 1fr"}
                  justifyContent={"flex-start"}
                  alignSelf={"center"}
                  gap={"4px"}
                  margin={"10px 0 16px 0"}
                  maxHeight={height - 300}
                  overflow={"hidden"}
                  overflowY={"scroll"}
                  marginBottom={"250px"}
                  paddingRight={width >= 600 ? "10px" : 0}
                >
                  {userStore?.cart != 0 &&
                    userStore.cart?.map((item, index) => (
                      <GridItem key={index}>
                        <CartProductCard obj={item} />
                      </GridItem>
                    ))}
                </Grid>
              </>
            ) : (
              <Text
                color={"rgba(248, 250, 252, 1)"}
                fontWeight={"500"}
                width={"max-content"}
                marginTop={"10px"}
                fontSize={"16px"}
                textAlign={"center"}
                alignSelf={"center"}
              >
                Корзина пуста
              </Text>
            )}
          </VStack>
        </VStack>
      </HStack>
    </>
  );
});

export default Cart;
