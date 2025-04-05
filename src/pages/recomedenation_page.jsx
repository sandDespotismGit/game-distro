import { Grid, GridItem, VStack } from "@chakra-ui/react";
import { observer } from "mobx-react-lite";

import Header from "../components/header";
import { useStores } from "../store/store_context";
import useWindowDimensions from "../components/windowDimensions";
import ProductCard from "../components/product_card";

const RecomendationPage = observer(() => {
  const { userStore, pageStore } = useStores();
  const { width } = useWindowDimensions();

  const sortProducts = () => {
    const copyProducts = [...pageStore.all_products];
    copyProducts.sort((a, b) => Number(b.sales) - Number(a.sales));

    return copyProducts;
  };

  const sortedGames = sortProducts();
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
      <VStack width={"100%"} position={"relative"} marginTop={"104px"}>
        <VStack
          justify={"flex-start"}
          align={"flex-start"}
          marginTop={"20px"}
          padding={
            width >= 1440
              ? "0 142px"
              : ["0 10px", "0 15px", "0 20px", "0 25px", "0 30px"]
          }
          gap={0}
        >
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
            {userStore.auth_token &&
              sortedGames.slice(0, 10)?.map((item, index) => (
                <GridItem key={index}>
                  <ProductCard obj={item} />
                </GridItem>
              ))}
          </Grid>
        </VStack>
      </VStack>
    </VStack>
  );
});

export default RecomendationPage;
