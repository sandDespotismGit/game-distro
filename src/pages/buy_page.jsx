import {
  Button,
  HStack,
  Image,
  Table,
  Tbody,
  Td,
  Text,
  Textarea,
  Th,
  Thead,
  Tr,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import Header from "../components/header";
import { useStores } from "../store/store_context";

import windows from "./../images/windows_icon.svg";
import mac from "./../images/apple_icon.svg";
import { useNavigate } from "react-router-dom";

const BuyPage = observer(() => {
  const { pageStore, userStore } = useStores();
  const navigate = useNavigate();
  const toast = useToast();

  const buy = async (price) => {
    return await userStore.buy(price);
  };
  const handleBuy = async () => {
    const response = await buy(
      userStore.boughts.length > 0
        ? pageStore.sum_cart_discount.toString()
        : (Number(pageStore.sum_cart_discount) * 0.95).toString()
    );
    if (response.ok) {
      const result = await response.json();
      if (result.result == "money too small") {
        toast({
          title: "Недостаточно средств",
          description: "Пополните баланс",
          status: "error",
          duration: 2000,
          isClosable: true,
        });
      } else {
        toast({
          title: "Успех",
          description: "Покупка совершена",
          status: "success",
          duration: 2000,
          isClosable: true,
        });
        navigate("/");
      }
    } else {
      toast({
        title: "Ошибка",
        description: "Ошибка",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
    }
  };

  return (
    <VStack
      width={"100%"}
      height={"auto"}
      minHeight={"100vh"}
      background={"rgba(18, 18, 18, 1)"}
      margin={0}
      padding={0}
      spacing={0}
      overflow={"hidden"}
    >
      <Header router={"buy"} isBuy={true} />

      <HStack marginTop={"60px"}>
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
          onClick={() => navigate("/")}
        >
          <Text
            color={"rgba(248, 250, 252, 1)"}
            fontSize={"16px"}
            fontWeight={"500"}
          >
            Назад
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
          onClick={async () => await handleBuy()}
        >
          <Text
            color={"rgba(248, 250, 252, 1)"}
            fontSize={"16px"}
            fontWeight={"500"}
          >
            Купить
          </Text>
        </Button>
      </HStack>
      <Text
        color={"white"}
        marginTop={"10px"}
        width={"100%"}
        marginLeft={"40px"}
      >
        Сумма без учета скидок: {pageStore.sum_cart} ₽
      </Text>
      <Text
        color={"white"}
        marginTop={"4px"}
        width={"100%"}
        marginLeft={"40px"}
      >
        Сумма с учетом скидок: {pageStore.sum_cart_discount} ₽
      </Text>
      {userStore?.boughts > 0 && (
        <Text
          color={"white"}
          marginTop={"4px"}
          width={"100%"}
          fontWeight={"600"}
          marginLeft={"40px"}
        >
          Итого: {pageStore.sum_cart_discount} ₽
        </Text>
      )}

      {userStore.boughts.length > 0 ? null : (
        <>
          <Text
            color={"white"}
            marginTop={"4px"}
            width={"100%"}
            marginLeft={"40px"}
          >
            Скидка новому пользователю: 5%
          </Text>
          <Text
            color={"white"}
            marginTop={"4px"}
            width={"100%"}
            fontWeight={"600"}
            marginLeft={"40px"}
          >
            Итого: {parseInt(pageStore.sum_cart_discount * 0.95)} ₽
          </Text>
        </>
      )}

      <VStack
        justify={"flex-start"}
        align={"flex-start"}
        gap={0}
        width={"100%"}
        overflow={"hidden"}
        overflowX={"scroll"}
        padding={"10px 20px"}
      >
        <Table width={"100%"} border={"2px solid rgba(56, 72, 87, 1)"}>
          <Thead bg={"rgba(26, 32, 40, 1)"} borderBottom={"none"}>
            <Tr>
              <Th color={"rgba(248, 250, 252, 1)"}>
                <Text>Название</Text>
              </Th>
              <Th color={"rgba(248, 250, 252, 1)"}>
                <Text>Жанр</Text>
              </Th>
              <Th color={"rgba(248, 250, 252, 1)"}>
                <Text>Платформы</Text>
              </Th>
              <Th color={"rgba(248, 250, 252, 1)"}>
                <Text>Описание</Text>
              </Th>
              <Th color={"rgba(248, 250, 252, 1)"}>
                <Text>Цена</Text>
              </Th>
              <Th color={"rgba(248, 250, 252, 1)"}>
                <Text>Изображение</Text>
              </Th>
              <Th color={"rgba(248, 250, 252, 1)"}>
                <Text>Дата выхода</Text>
              </Th>
            </Tr>
          </Thead>
          <Tbody>
            {userStore.cart?.length != 0 &&
              userStore.cart?.map((elem, index) => {
                return (
                  <Tr color={"rgba(248, 250, 252, 1)"} key={index}>
                    <Td>
                      <Text>{elem?.name}</Text>
                    </Td>
                    <Td>
                      <Text>{elem?.genre}</Text>
                    </Td>
                    <Td>
                      <HStack gap={"3px"}>
                        {elem?.platforms?.split(",")?.map((item, index) => (
                          <Image
                            src={item == "windows" ? windows : mac}
                            key={index}
                          />
                        ))}
                      </HStack>
                    </Td>
                    <Td width={"400px"}>
                      <Textarea
                        disabled={true}
                        color={"white"}
                        value={`${elem?.description}`}
                      />
                    </Td>
                    <Td>
                      <Text>
                        {elem?.price == "0"
                          ? "Бесплатно"
                          : userStore.boughts?.length == 0
                          ? `${parseInt(Number(elem?.price * 0.95))} ₽`
                          : `${elem?.price} ₽`}
                      </Text>
                    </Td>
                    <Td>
                      <Image
                        src={`http://212.41.9.251:8013/${elem?.picture_url}`}
                        alt="Нет картинки"
                        height={"80px"}
                        borderRadius={"8px"}
                      />
                    </Td>
                    <Td>
                      <Text>{new Date(elem?.date).toLocaleDateString()}</Text>
                    </Td>
                  </Tr>
                );
              })}
          </Tbody>
        </Table>
      </VStack>
    </VStack>
  );
});

export default BuyPage;
