import {
  VStack,
  HStack,
  Stack,
  Text,
  Grid,
  GridItem,
  Table,
  Th,
  Thead,
  Tbody,
  Td,
  Tr,
  Image,
  Textarea,
} from "@chakra-ui/react";
import { useStores } from "../store/store_context";
import { observer } from "mobx-react-lite";

import Header from "../components/header";
import Sale from "../components/sale";
import SearchBar from "../components/search_bar";
import Sort from "../components/sort";
import Filter from "../components/filter";
import ProductCard from "../components/product_card";
import useWindowDimensions from "../components/windowDimensions";
import ModalAddProduct from "../components/modal_add_product";
import { useEffect, useState } from "react";

import windows from "./../images/windows_icon.svg";
import mac from "./../images/apple_icon.svg";
import ModalEditProduct from "../components/modal_edit_product";
import ModalDeleteProduct from "../components/modal_delete_product";
import Cookies from "js-cookie";

const MainPage = observer(() => {
  const { pageStore, userStore } = useStores();
  const { width } = useWindowDimensions();

  const getUniqueGenres = (products) => {
    let allGenres = "";
    if (products?.length > 0) {
      allGenres = products?.flatMap((product) => product?.genre?.split(","));
    }

    return [...new Set(allGenres)];
  };

  const uniqueGenres = getUniqueGenres(pageStore.all_products);

  const filterProductByProducer =
    pageStore.all_products?.length > 0
      ? pageStore.all_products?.filter(
          (item) => item.producer_name == userStore.user_info?.username
        )
      : null;

  const applyFilters = () => {
    let copyProducts = [...pageStore.all_products];

    if (pageStore.selected_genre) {
      copyProducts = copyProducts?.filter((item) =>
        item?.genre.includes(pageStore.selected_genre)
      );
    }
    if (pageStore.selected_producer) {
      copyProducts = copyProducts?.filter(
        (item) => item?.producer_name == pageStore.selected_producer
      );
    }
    if (pageStore.min_price) {
      copyProducts = copyProducts?.filter(
        (item) =>
          Number(item?.price * (1 - Number(item?.discount) / 100)) >=
          Number(pageStore.min_price)
      );
    }

    if (pageStore.max_price) {
      copyProducts = copyProducts?.filter(
        (item) =>
          Number(item?.price) * (1 - Number(item?.discount) / 100) <=
          Number(pageStore.max_price)
      );
    }

    if (pageStore.search_bar) {
      const searchLower = pageStore.search_bar.toLowerCase();
      copyProducts = copyProducts?.filter((item) => {
        return item?.name?.toLowerCase().includes(searchLower) ?? false;
      });
    }

    return copyProducts;
  };

  const filtered = applyFilters();

  const sortProduct = (arr) => {
    const copy_products = [...arr];
    if (pageStore.sort[0] == 1) {
      copy_products.sort((a, b) => a.name.localeCompare(b.name));
    } else if (pageStore.sort[1] == 1) {
      copy_products.sort((a, b) => b.name.localeCompare(a.name));
    } else if (pageStore.sort[2] == 1) {
      copy_products.sort(
        (a, b) =>
          Number(a.price) * (1 - Number(a.discount) / 100) -
          Number(b.price) * (1 - Number(b.discount) / 100)
      );
    } else {
      copy_products.sort(
        (a, b) =>
          Number(b.price) * (1 - Number(b.discount) / 100) -
          Number(a.price) * (1 - Number(a.discount) / 100)
      );
    }

    return copy_products;
  };

  let sorted = sortProduct(filtered);

  useEffect(() => {
    pageStore.getAllGames();
    const checkAuth = async () => {
      const token = Cookies.get("auth_token");
      if (!token) {
        return;
      }

      const isValid = await userStore.getMe(token);
      if (isValid) {
        userStore.getMe(token);
        userStore.getCart(token);
        userStore.getBought(token);
        userStore.updateToken(token);
      } else {
        Cookies.remove("auth_token");
      }
    };

    checkAuth();
  }, []);

  return (
    <VStack
      width={"100%"}
      height={"auto"}
      minHeight={"100vh"}
      background={"rgba(18, 18, 18, 1)"}
      margin={0}
      padding={0}
      spacing={0}
      position={"relative"}
      overflow={"hidden"}
    >
      <Header />
      {!userStore.user_info?.is_seller ? (
        <VStack width={"100%"} position={"relative"} marginTop={"104px"}>
          {userStore.auth_token == "" ? <Sale /> : null}
          <VStack
            justify={"flex-start"}
            align={"flex-start"}
            padding={
              width >= 1440
                ? "0 142px"
                : ["0 10px", "0 15px", "0 20px", "0 25px", "0 30px"]
            }
            gap={0}
          >
            <HStack
              gap={width >= 1440 ? "16px" : ["10px"]}
              marginTop={"16px"}
              justify={"center"}
              width={"100%"}
              overflow={"hidden"}
            >
              <SearchBar />
              <Sort />
              <Filter />
            </HStack>
            <HStack
              width={width >= 1400 ? "1152px" : width - 20}
              marginTop={"16px"}
              paddingBottom={"10px"}
              gap={"8px"}
              overflow={"hidden"}
              overflowX={"scroll"}
            >
              <Stack
                onClick={() => pageStore.updateSelectedGenre(null)}
                height={"40px"}
                padding={"0 16px"}
                bg={
                  pageStore.selected_genre == null
                    ? "rgba(0, 84, 87, 1)"
                    : "rgba(26, 32, 40, 1)"
                }
                border={
                  pageStore.selected_genre == null
                    ? "1px solid rgba(112, 239, 222, 1)"
                    : "1px solid rgba(56, 72, 87, 1)"
                }
                borderRadius={"100px"}
                justify={"center"}
                align={"center"}
                cursor={"pointer"}
                _hover={{
                  bgColor: "rgba(0, 84, 87, 1)",
                  border: "1px solid rgba(112, 239, 222, 1)",
                }}
                transition={"background-color 0.3s ease, border 0.3s ease"}
              >
                <Text
                  color={"rgba(248, 250, 252, 1)"}
                  fontSize={"16px"}
                  fontWeight={"500"}
                  width={"max-content"}
                >
                  Все жанры
                </Text>
              </Stack>
              {uniqueGenres?.map((item, index) => (
                <Stack
                  key={index}
                  onClick={() => pageStore.updateSelectedGenre(item)}
                  height={"40px"}
                  padding={"0 16px"}
                  bg={
                    item == pageStore.selected_genre
                      ? "rgba(0, 84, 87, 1)"
                      : "rgba(26, 32, 40, 1)"
                  }
                  border={
                    item == pageStore.selected_genre
                      ? "1px solid rgba(112, 239, 222, 1)"
                      : "1px solid rgba(56, 72, 87, 1)"
                  }
                  borderRadius={"100px"}
                  justify={"center"}
                  align={"center"}
                  cursor={"pointer"}
                  _hover={{
                    bgColor: "rgba(0, 84, 87, 1)",
                    border: "1px solid rgba(112, 239, 222, 1)",
                  }}
                  transition={"background-color 0.3s ease, border 0.3s ease"}
                >
                  <Text
                    color={"rgba(248, 250, 252, 1)"}
                    fontSize={"16px"}
                    fontWeight={"500"}
                    width={"max-content"}
                  >
                    {item}
                  </Text>
                </Stack>
              ))}
            </HStack>
            <Grid
              gridTemplateColumns={
                width >= 1040
                  ? "1fr 1fr 1fr 1fr"
                  : width >= 715
                  ? "1fr 1fr 1fr"
                  : "1fr 1fr"
              }
              alignSelf={"center"}
              gap={"10px"}
              margin={"6px 0 16px 0"}
            >
              {sorted.length != 0
                ? sorted?.map((item, index) => (
                    <GridItem key={index}>
                      <ProductCard obj={item} />
                    </GridItem>
                  ))
                : null}
            </Grid>
          </VStack>
        </VStack>
      ) : (
        <VStack
          justify={"flex-start"}
          align={"flex-start"}
          gap={0}
          width={"100%"}
          overflow={"hidden"}
          overflowX={"scroll"}
          padding={"20px"}
        >
          <ModalAddProduct />
          <Table
            width={"100%"}
            padding={"10px"}
            border={"2px solid rgba(56, 72, 87, 1)"}
            marginTop={"10px"}
          >
            <Thead bg={"rgba(26, 32, 40, 1)"} borderBottom={"none"}>
              <Tr>
                <Th color={"rgba(248, 250, 252, 1)"}>
                  <Text>ID</Text>
                </Th>
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
                  <Text>Цена со скидкой</Text>
                </Th>
                <Th color={"rgba(248, 250, 252, 1)"}>
                  <Text>Кол-во продаж</Text>
                </Th>
                <Th color={"rgba(248, 250, 252, 1)"}>
                  <Text>Изображение</Text>
                </Th>
                <Th color={"rgba(248, 250, 252, 1)"}>
                  <Text>Дата выхода</Text>
                </Th>
                <Th color={"rgba(248, 250, 252, 1)"}>
                  <Text>Действия</Text>
                </Th>
              </Tr>
            </Thead>
            <Tbody>
              {filterProductByProducer?.length != 0 &&
                filterProductByProducer?.map((elem, index) => {
                  return (
                    <Tr color={"rgba(248, 250, 252, 1)"} key={index}>
                      <Td>
                        <Text>{elem?.id}</Text>
                      </Td>
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
                        <Text width={"max-content"}>
                          {elem?.price == "0" ? "Free" : `${elem?.price} ₽`}
                        </Text>
                      </Td>
                      <Td>
                        <Text>
                          {Number(elem?.price) *
                            Number(1 - elem.discount / 100)}{" "}
                          ₽ ({elem.discount}%)
                        </Text>
                      </Td>
                      <Td>
                        {/* количество продаж */}
                        <Text>{elem?.sales || 0}</Text>
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
                      <Td width={"100px"}>
                        <HStack>
                          <ModalEditProduct obj={elem} />
                          <ModalDeleteProduct obj={elem} />
                        </HStack>
                      </Td>
                    </Tr>
                  );
                })}
            </Tbody>
          </Table>
        </VStack>
      )}
    </VStack>
  );
});

export default MainPage;
