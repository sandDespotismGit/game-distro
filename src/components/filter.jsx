import { HStack, Image, Input, Stack, Text, VStack } from "@chakra-ui/react";
import { useState } from "react";

import useWindowDimensions from "./windowDimensions";

import filterIcon from "./../images/filter_icon.svg";
import closeWhiteIcon from "./../images/closw_icon_white.svg";
import selectArrow from "./../images/arrow_down_icon.svg";
import clearFilterIcon from "./../images/clear_filter.svg";
import { useStores } from "../store/store_context";
import { observer } from "mobx-react-lite";

const Filter = observer(() => {
  const [openFilters, setOpenFilters] = useState(false);
  const [openCategory, setOpenCategory] = useState(false);
  const [openCreator, setOpenCreator] = useState(false);

  const { width, height } = useWindowDimensions();

  const { pageStore } = useStores();

  const getUniqueGenres = (products) => {
    let allGenres = "";
    if (products?.length > 0) {
      allGenres = products?.flatMap((product) => product?.genre?.split(","));
    }

    return [...new Set(allGenres)];
  };

  const uniqueGenres = getUniqueGenres(pageStore.all_products);

  const getUniqueProducer = (products) => {
    let allProducer = "";
    if (products?.length > 0) {
      allProducer = products?.flatMap((product) =>
        product?.producer_name?.split(",")
      );
    }

    return [...new Set(allProducer)];
  };

  const uniqueProducer = getUniqueProducer(pageStore.all_products);

  return (
    <>
      <HStack
        cursor={"pointer"}
        height={"40px"}
        gap={"8px"}
        padding={"0 16px"}
        flexShrink={0}
        border={
          openFilters
            ? "1px solid rgba(112, 239, 222, 1)"
            : "1px solid rgba(56, 72, 87, 1)"
        }
        _hover={{
          bgColor: "rgba(0, 84, 87, 1)",
          border: "1px solid rgba(112, 239, 222, 1)",
        }}
        borderRadius={"8px"}
        onClick={() => setOpenFilters(!openFilters)}
        bg={openFilters ? "rgba(0, 84, 87, 1)" : null}
        transition={"background-color 0.3s ease, border 0.3s ease"}
      >
        <Image src={filterIcon} />
        {width >= 760 && (
          <Text color={"white"} fontSize={"16px"} fontWeight={"500"}>
            Фильтры
          </Text>
        )}
      </HStack>
      <HStack
        bg={"rgba(0,0,0,0)"}
        position={"fixed"}
        top={"104px"}
        overflow={"hidden"}
        right={0}
        width={openFilters ? width : 0}
        transition={"width 0.3s ease"}
        zIndex={1000}
        align={"flex-start"}
        gap={0}
      >
        <VStack
          width={width > 600 ? "100%" : 0}
          minHeight={"100vh"}
          height={"auto"}
          onClick={() => setOpenFilters(false)}
        />
        <VStack
          width={
            openFilters && width > 600
              ? "320px"
              : openFilters && width <= 600
              ? width
              : 0
          }
          bg={"rgba(14, 18, 22, 1)"}
          minH={"100vh"}
          height={"auto"}
          borderLeft={
            openFilters && width > 600
              ? "1px solid rgba(56, 72, 87, 1)"
              : "none"
          }
          borderTop={
            openFilters && width > 600
              ? "1px solid rgba(56, 72, 87, 1)"
              : "none"
          }
          transition={"width 0.3s ease"}
        >
          <VStack
            position={"relative"}
            width={"100%"}
            padding={"24px 16px"}
            opacity={openFilters ? 1 : 0}
            transition={"opacity .3s ease"}
            height={"100%"}
            justify={"space-between"}
          >
            <VStack width={"100%"}>
              <Text
                color={"rgba(248, 250, 252, 1)"}
                fontSize={"24px"}
                fontWeight={"600"}
                width={"max-content"}
              >
                Фильтры
              </Text>
              <Image
                onClick={() => setOpenFilters(false)}
                src={closeWhiteIcon}
                position={"absolute"}
                right={"16px"}
                top={"16px"}
                visibility={openFilters ? "visible" : "hidden"}
                cursor={"pointer"}
              />
              <VStack
                width={"100%"}
                align={"flex-start"}
                height={height - 250}
                overflow={"hidden"}
                overflowY={"scroll"}
              >
                <Text
                  color={"rgba(248, 250, 252, 1)"}
                  fontSize={"12px"}
                  fontWeight={"500"}
                  textAlign={"left"}
                  width={"max-content"}
                >
                  Категория игры
                </Text>
                <VStack width={"100%"} gap={0} position={"relative"}>
                  <HStack
                    minWidth={"100%"}
                    width={"max-content"}
                    justify={"space-between"}
                    padding={"0 10px"}
                    height={"40px"}
                    border={"1px solid rgba(56, 72, 87, 1)"}
                    borderRadius={"8px"}
                    cursor={"pointer"}
                    onClick={() => setOpenCategory(!openCategory)}
                    bg={"rgba(26, 32, 40, 1)"}
                  >
                    <Text
                      color={
                        pageStore.selected_genre
                          ? "rgba(248, 250, 252, 1)"
                          : "rgba(148, 163, 184, 1)"
                      }
                      fontSize={"16px"}
                      fontWeight={"500"}
                      width={"max-content"}
                    >
                      {pageStore.selected_genre
                        ? pageStore.selected_genre
                        : "Выберите категорию"}
                    </Text>
                    <Image
                      src={selectArrow}
                      transform={
                        openCategory ? "rotate(180deg)" : "rotate(0deg)"
                      }
                      transition={"transform 0.2s ease"}
                    />
                  </HStack>
                  <VStack
                    overflow={"hidden"}
                    marginTop={"4px"}
                    border={
                      openCategory ? "1px solid rgba(56, 72, 87, 1)" : "none"
                    }
                    borderRadius={"10px"}
                    padding={openCategory ? "4px 0px" : 0}
                    width={"100%"}
                    align={"flex-start"}
                    opacity={openCategory ? 1 : 0}
                    display={openCategory ? "flex" : "none"}
                  >
                    {uniqueGenres?.map((item, index) => (
                      <Text
                        key={index}
                        color={
                          pageStore.selected_genre == item
                            ? "rgba(248, 250, 252, 1)"
                            : "rgba(148, 163, 184, 1)"
                        }
                        cursor={"pointer"}
                        width={"100%"}
                        height={"28px"}
                        padding={"0 12px"}
                        bg={
                          pageStore.selected_genre == item
                            ? "rgba(0, 84, 87, 1)"
                            : null
                        }
                        _hover={{
                          color: "rgba(248, 250, 252, 1)",
                        }}
                        onClick={() => {
                          pageStore.updateSelectedGenre(item);
                          setOpenCategory(false);
                        }}
                      >
                        {item}
                      </Text>
                    ))}
                  </VStack>
                </VStack>
                <Text
                  color={"rgba(248, 250, 252, 1)"}
                  fontSize={"12px"}
                  fontWeight={"500"}
                  textAlign={"left"}
                  width={"max-content"}
                >
                  Разработчик
                </Text>
                <VStack width={"100%"} gap={0} position={"relative"}>
                  <HStack
                    minWidth={"100%"}
                    width={"max-content"}
                    justify={"space-between"}
                    padding={"0 10px"}
                    height={"40px"}
                    border={"1px solid rgba(56, 72, 87, 1)"}
                    borderRadius={"8px"}
                    cursor={"pointer"}
                    onClick={() => setOpenCreator(!openCreator)}
                    bg={"rgba(26, 32, 40, 1)"}
                  >
                    <Text
                      color={
                        pageStore.selected_producer
                          ? "rgba(248, 250, 252, 1)"
                          : "rgba(148, 163, 184, 1)"
                      }
                      fontSize={"16px"}
                      fontWeight={"500"}
                      width={"max-content"}
                    >
                      {pageStore.selected_producer
                        ? pageStore.selected_producer
                        : "Выберите разработчика"}
                    </Text>
                    <Image
                      src={selectArrow}
                      transform={
                        openCreator ? "rotate(180deg)" : "rotate(0deg)"
                      }
                      transition={"transform 0.2s ease"}
                    />
                  </HStack>
                  <VStack
                    overflow={"hidden"}
                    marginTop={"4px"}
                    border={
                      openCreator ? "1px solid rgba(56, 72, 87, 1)" : "none"
                    }
                    borderRadius={"10px"}
                    padding={openCreator ? "4px 0px" : 0}
                    width={"100%"}
                    align={"flex-start"}
                    opacity={openCreator ? 1 : 0}
                    display={openCreator ? "flex" : "none"}
                  >
                    {uniqueProducer?.map((item, index) => (
                      <Text
                        key={index}
                        color={
                          pageStore.selected_producer == item
                            ? "rgba(248, 250, 252, 1)"
                            : "rgba(148, 163, 184, 1)"
                        }
                        cursor={"pointer"}
                        width={"100%"}
                        height={"28px"}
                        padding={"0 12px"}
                        bg={
                          pageStore.selected_producer == item
                            ? "rgba(0, 84, 87, 1)"
                            : null
                        }
                        _hover={{
                          color: "rgba(248, 250, 252, 1)",
                        }}
                        onClick={() => {
                          pageStore.updateSelectedProducer(item);
                          setOpenCreator(false);
                        }}
                      >
                        {item}
                      </Text>
                    ))}
                  </VStack>
                  <Stack width={"100%"}>
                    <Text
                      color={"rgba(248, 250, 252, 1)"}
                      fontSize={"12px"}
                      fontWeight={"500"}
                      marginTop={"16px"}
                      w={"max-content"}
                    >
                      Цена
                    </Text>
                  </Stack>

                  <HStack
                    marginTop={"8px"}
                    width={"100%"}
                    align={"center"}
                    gap={"14px"}
                  >
                    <Input
                      placeholder="min"
                      fontFamily={"Inter"}
                      height={"40px"}
                      bg={"rgba(26, 32, 40, 1)"}
                      border={"1px solid rgba(56, 72, 87, 1)"}
                      borderRadius={"8px"}
                      color={"rgba(248, 250, 252, 1)"}
                      _placeholder={{
                        color: "rgba(148, 163, 184, 1)",
                      }}
                      value={pageStore.min_price ?? ""}
                      onChange={(e) => pageStore.updateMinPrice(e.target.value)}
                    />
                    <Stack
                      height={"1px"}
                      bg={"rgba(148, 163, 184, 1)"}
                      minWidth={"20px"}
                    />
                    <Input
                      fontFamily={"Inter"}
                      placeholder="max"
                      height={"40px"}
                      bg={"rgba(26, 32, 40, 1)"}
                      border={"1px solid rgba(56, 72, 87, 1)"}
                      borderRadius={"8px"}
                      color={"rgba(248, 250, 252, 1)"}
                      _placeholder={{
                        color: "rgba(148, 163, 184, 1)",
                      }}
                      value={pageStore.max_price ?? ""}
                      onChange={(e) => pageStore.updateMaxPrice(e.target.value)}
                    />
                  </HStack>
                </VStack>
              </VStack>
            </VStack>
            <HStack
              width={"100%"}
              height={"40px"}
              border={"1px solid rgba(56, 72, 87, 1)"}
              borderRadius={"8px"}
              justify={"center"}
              cursor={"pointer"}
              bg={"rgba(14, 18, 22, 1)"}
              _hover={{
                bgColor: "rgba(0, 84, 87, 1)",
                border: "1px solid rgba(112, 239, 222, 1)",
              }}
              transition={"background-color 0.3s ease, border 0.3s ease"}
              onClick={() => pageStore.resetFilters()}
            >
              <Image src={clearFilterIcon} />
              <Text
                color={"rgba(248, 250, 252, 1)"}
                fontSize={"16px"}
                fontWeight={"500"}
                width={"max-content"}
                flexShrink={0}
              >
                Сбросить фильтры
              </Text>
            </HStack>
          </VStack>
        </VStack>
      </HStack>
    </>
  );
});

export default Filter;
