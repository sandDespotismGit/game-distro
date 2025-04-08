import { Grid, GridItem, Text, VStack } from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import Header from "../components/header";
import ProductCard from "../components/product_card";
import { useStores } from "../store/store_context";
import useWindowDimensions from "../components/windowDimensions";

const PurchaseHistoryPage = observer(() => {
  const { userStore } = useStores();
  const { width } = useWindowDimensions();
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
      <Header router={"purchase"} />

      <Text color={"white"} marginTop={"60px"} fontWeight={"600"}>
        История покупок
      </Text>

      <VStack
        justify={"flex-start"}
        align={"flex-start"}
        padding={
          width >= 1440
            ? "0 142px"
            : ["0 10px", "0 15px", "0 20px", "0 25px", "0 30px"]
        }
        gap={0}
        width={"100%"}
      >
        {userStore.boughts?.length != 0 ? (
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
            margin={"16px 0"}
            width={"100%"}
          >
            {userStore.boughts?.map((item, index) => (
              <GridItem key={index}>
                <ProductCard obj={item} />
              </GridItem>
            ))}
          </Grid>
        ) : (
          <Text
            color={"white"}
            width={"100%"}
            textAlign={"center"}
            marginTop={"10px"}
          >
            Вы ничего не покупали
          </Text>
        )}
      </VStack>
    </VStack>
  );
});

export default PurchaseHistoryPage;
