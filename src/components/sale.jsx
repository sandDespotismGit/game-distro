import { HStack, Image, Text } from "@chakra-ui/react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import useWindowDimensions from "./windowDimensions";

import backSale from "./../images/back_sale.png";
import saleIcon from "./../images/sale_icon.svg";
import closeIcon from "./../images/close_icon.svg";

const Sale = () => {
  const [isVisible, setIsVisible] = useState(true);

  const { width } = useWindowDimensions();
  const navigate = useNavigate();

  return (
    <HStack
      padding={isVisible ? "10px 32px" : 0}
      width={"100%"}
      backgroundImage={backSale}
      overflow={"hidden"}
      justify={width >= 700 ? "center" : "flex-start"}
      position={"relative"}
      height={isVisible ? "44px" : 0}
      opacity={isVisible ? 1 : 0}
      transition={"opacity 0.3s ease, padding 0.3s ease, height 0.5s ease"}
    >
      <HStack gap={"8px"}>
        <Image src={saleIcon} />
        <HStack gap={"2px"}>
          <Text
            color={"rgba(14, 18, 22, 1)"}
            fontSize={width >= 1440 ? "16px" : ["12px", "12px", "14px", "15px"]}
            fontWeight={"500"}
          >
            Дарим новым пользователям скидку 5% на первую покупку.{" "}
            <span
              style={{ cursor: "pointer", textDecoration: "underline" }}
              onClick={() => navigate("/auth")}
            >
              Зарегистрироваться
            </span>
          </Text>
        </HStack>
      </HStack>
      <Image
        src={closeIcon}
        position={"absolute"}
        right={
          width >= 1440 ? "32px" : ["10px", "10px", "20px", "26px", "32px"]
        }
        top={"10px"}
        cursor={"pointer"}
        onClick={() => setIsVisible(false)}
      />
    </HStack>
  );
};

export default Sale;
