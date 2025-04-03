import {
  Button,
  FormControl,
  FormErrorMessage,
  HStack,
  Input,
  Modal,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  Text,
  useDisclosure,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { Form, Formik } from "formik";
import { observer } from "mobx-react-lite";
import * as Yup from "yup";
import { useStores } from "../store/store_context";
import { useNavigate } from "react-router-dom";

const ModalIncreaseBalance = observer(() => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { userStore } = useStores();
  const toast = useToast();
  const navigate = useNavigate();

  const increaseBalance = async (values) => {
    return await userStore.increaseBalance(values);
  };

  const handleIncreaseBalance = async (values) => {
    const ok = await increaseBalance(values);
    if (ok) {
      toast({
        title: "Успех",
        description: "Баланс пополнен",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
      onClose();
    } else {
      toast({
        title: "Ошибка",
        description: "Ошибка при пополнении баланса",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
    }
  };

  return (
    <>
      <Text
        color={"white"}
        textDecoration={"underline"}
        cursor={"pointer"}
        onClick={onOpen}
        width={"max-content"}
      >
        Пополнить баланс
      </Text>
      <Modal
        blockScrollOnMount
        isOpen={isOpen}
        onClose={onClose}
        size={"2xl"}
        isCentered
        scrollBehavior={"inside"}
      >
        <ModalOverlay bg={"rgba(0,0,0,0.7)"} />
        <ModalContent
          padding={"20px"}
          borderRadius={"8px"}
          bg={"rgba(14, 18, 22, 1)"}
          border={"1px solid rgba(56, 72, 87, 1)"}
        >
          <ModalCloseButton color={"white"} />
          <Formik
            initialValues={{
              balance: "",
            }}
            validationSchema={Yup.object({
              balance: Yup.string("Обязательное поле")
                .min(2, "Поле должно содержать минумум 2 символа")
                .matches(/^\d+$/, "Допускаются только цифры"),
            })}
            onSubmit={handleIncreaseBalance}
          >
            {({ errors, touched, handleChange, handleBlur }) => (
              <Form>
                <VStack gap={0}>
                  <Text
                    color={"rgba(248, 250, 252, 1)"}
                    fontWeight={"500"}
                    fontSize={"18px"}
                  >
                    Пополнение баланса
                  </Text>
                  {userStore.user_info?.cards?.length != 0 ? (
                    <FormControl isInvalid={errors.balance && touched.balance}>
                      <Input
                        fontFamily={"Inter"}
                        placeholder="Введите сумму"
                        name="balance"
                        height={"40px"}
                        marginTop={"10px"}
                        background={"rgba(14, 18, 22, 1)"}
                        border={"1px solid rgba(56, 72, 87, 1)"}
                        borderRadius={"8px"}
                        color={"rgba(248, 250, 252, 1)"}
                        _placeholder={{
                          color: "rgba(148, 163, 184, 1)",
                        }}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                      <FormErrorMessage margin={"2px"} fontSize={"12px"}>
                        {errors.balance}
                      </FormErrorMessage>
                    </FormControl>
                  ) : (
                    <Text color={"white"} marginTop={"10px"}>
                      У вас не привязана карта
                    </Text>
                  )}

                  {userStore.user_info?.cards?.length != 0 ? (
                    <HStack marginTop={"10px"}>
                      <Button
                        bg={"rgba(26, 32, 40, 1)"}
                        border={"1px solid rgba(56, 72, 87, 1)"}
                        _hover={{
                          bg: "rgba(0, 84, 87, 1)",
                        }}
                        onClick={onClose}
                      >
                        <Text
                          color={"rgba(248, 250, 252, 1)"}
                          fontSize={"16px"}
                          fontWeight={"500"}
                        >
                          Отменить
                        </Text>
                      </Button>
                      <Button
                        type="submit"
                        bg={"rgba(26, 32, 40, 1)"}
                        border={"1px solid rgba(56, 72, 87, 1)"}
                        _hover={{
                          bg: "rgba(0, 84, 87, 1)",
                        }}
                      >
                        <Text
                          color={"rgba(248, 250, 252, 1)"}
                          fontSize={"16px"}
                          fontWeight={"500"}
                        >
                          Пополнить
                        </Text>
                      </Button>
                    </HStack>
                  ) : (
                    <Button
                      onClick={() => {
                        navigate("/edit_profile");
                      }}
                      bg={"rgba(26, 32, 40, 1)"}
                      border={"1px solid rgba(56, 72, 87, 1)"}
                      _hover={{
                        bg: "rgba(0, 84, 87, 1)",
                      }}
                      marginTop={"10px"}
                    >
                      <Text
                        color={"rgba(248, 250, 252, 1)"}
                        fontSize={"16px"}
                        fontWeight={"500"}
                      >
                        Привязать
                      </Text>
                    </Button>
                  )}
                </VStack>
              </Form>
            )}
          </Formik>
        </ModalContent>
      </Modal>
    </>
  );
});

export default ModalIncreaseBalance;
