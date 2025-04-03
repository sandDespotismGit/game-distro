import {
  Button,
  Checkbox,
  CheckboxGroup,
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

import useWindowDimensions from "./windowDimensions";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import { useStores } from "../store/store_context";
import { observer } from "mobx-react-lite";
import { useState } from "react";

const ModalAddProduct = observer(() => {
  const { width } = useWindowDimensions();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { pageStore, userStore } = useStores();
  const toast = useToast();

  const [file, setFile] = useState("");

  console.log(file[0]);

  const createGame = async (
    auth_token,
    name,
    desc,
    genre,
    price,
    platforms
  ) => {
    return await pageStore.createGame(
      auth_token,
      name,
      desc,
      genre,
      price,
      platforms
    );
  };

  const addPhoto = async (id, image) => {
    const formData = new FormData();
    formData.append("image", image);
    console.log("form", formData);
    await pageStore.addPhotoToGame(id, userStore.auth_token, formData);
  };

  const handleCreateGame = async (values) => {
    const result = await createGame(
      userStore.auth_token,
      values?.name,
      values?.description,
      values?.genre.join(),
      values?.price,
      values?.platforms.join()
    );
    if (result?.message == "Game created") {
      toast({
        title: "Успех",
        description: "Игра опубликована",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
      await addPhoto(result?.id, file[0]);
      setFile("");
      onClose();
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
    <>
      <Button
        alignSelf={"flex-start"}
        height={"40px"}
        border={"1px solid rgba(56, 72, 87, 1)"}
        bg={"rgba(26, 32, 40, 1)"}
        borderRadius={"100px"}
        padding={"0 16px"}
        onClick={onOpen}
        _hover={{
          bg: "rgba(0, 84, 87, 1)",
          border: "1px solid rgba(112, 239, 222, 1)",
        }}
        marginTop={"60px"}
      >
        <Text
          color={"rgba(248, 250, 252, 1)"}
          fontSize={"16px"}
          fontWeight={"500"}
        >
          Добавить игру
        </Text>
      </Button>
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
          overflow={"hidden"}
          overflowY={"scroll"}
        >
          <ModalCloseButton color={"rgba(248, 250, 252, 1)"} />
          <Formik
            initialValues={{
              name: "",
              genre: [],
              platforms: [],
              description: "",
              price: "",
            }}
            validationSchema={Yup.object({
              name: Yup.string().required("Обязательное поле"),
              genre: Yup.array()
                .required("Обязательное поле")
                .min(1, "Выберите хотя бы один жанр"),
              platforms: Yup.array().min(1, "Выберите хотя бы одно поле"),
              description: Yup.string().required("Обязательное поле"),
              price: Yup.number().required("Обязательное поле"),
            })}
            onSubmit={handleCreateGame}
          >
            {({
              values,
              errors,
              touched,
              handleChange,
              handleBlur,
              setFieldValue,
            }) => (
              <Form>
                {console.log(values)}
                <VStack
                  marginTop={"20px"}
                  width={"100%"}
                  height={"auto"}
                  padding={"12px"}
                  align={"flex-start"}
                  borderRadius={"8px"}
                  bg={"rgba(14, 18, 22, 1)"}
                >
                  <FormControl isInvalid={errors.name && touched.name}>
                    <Text fontWeight={"500"} color={"rgba(248, 250, 252, 1)"}>
                      Название
                    </Text>
                    <Input
                      marginTop={"4px"}
                      fontFamily={"Inter"}
                      placeholder="Название"
                      name="name"
                      height={"40px"}
                      width={"100%"}
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
                      {errors.name}
                    </FormErrorMessage>
                  </FormControl>
                  <FormControl isInvalid={errors.genre && touched.genre}>
                    <Text fontWeight={"500"} color={"rgba(248, 250, 252, 1)"}>
                      Жанр
                    </Text>
                    <CheckboxGroup
                      onChange={(e) => setFieldValue("genre", e)}
                      value={values?.genre}
                    >
                      <VStack
                        align={"flex-start"}
                        color={"white"}
                        marginTop={"10px"}
                      >
                        {pageStore.genre?.sort()?.map((item, index) => (
                          <Checkbox value={item} key={index}>
                            {item}
                          </Checkbox>
                        ))}
                      </VStack>
                    </CheckboxGroup>
                  </FormControl>
                  <FormControl
                    isInvalid={errors.platforms && touched.platforms}
                    marginTop={"10px"}
                  >
                    <Text fontWeight={"500"} color={"rgba(248, 250, 252, 1)"}>
                      Платформа
                    </Text>
                    <CheckboxGroup
                      value={values.platforms}
                      onChange={(e) => setFieldValue("platforms", e)}
                    >
                      <VStack
                        align={"flex-start"}
                        color={"white"}
                        marginTop={"10px"}
                      >
                        <Checkbox value={"windows"}>Windows</Checkbox>
                        <Checkbox value={"mac"}>MAC</Checkbox>
                      </VStack>
                    </CheckboxGroup>

                    <FormErrorMessage margin={"2px"} fontSize={"12px"}>
                      {errors.platforms}
                    </FormErrorMessage>
                  </FormControl>
                  <FormControl
                    isInvalid={errors.description && touched.description}
                  >
                    <Text fontWeight={"500"} color={"rgba(248, 250, 252, 1)"}>
                      Описание
                    </Text>
                    <Input
                      marginTop={"4px"}
                      fontFamily={"Inter"}
                      placeholder="Описание"
                      name="description"
                      height={"40px"}
                      width={"100%"}
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
                      {errors.description}
                    </FormErrorMessage>
                  </FormControl>
                  <FormControl isInvalid={errors.price && touched.price}>
                    <Text fontWeight={"500"} color={"rgba(248, 250, 252, 1)"}>
                      Цена
                    </Text>
                    <Input
                      marginTop={"4px"}
                      fontFamily={"Inter"}
                      placeholder="Цена"
                      name="price"
                      height={"40px"}
                      width={"40%"}
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
                      {errors.price}
                    </FormErrorMessage>
                    <Text color={"white"} fontSize={"12px"} marginTop={"2px"}>
                      Если игра бесплатная, то ставь 0
                    </Text>
                  </FormControl>

                  <FormControl>
                    <Text fontWeight={"500"} color={"rgba(248, 250, 252, 1)"}>
                      Изображение
                    </Text>
                    <Input
                      marginTop={"4px"}
                      fontFamily={"Inter"}
                      type="file"
                      accept="image/*"
                      //   name="image"
                      height={"40px"}
                      width={"max-content"}
                      background={"rgba(14, 18, 22, 1)"}
                      //   border={"1px solid rgba(56, 72, 87, 1)"}
                      border={"none"}
                      borderRadius={"8px"}
                      color={"rgba(248, 250, 252, 1)"}
                      _placeholder={{
                        color: "rgba(148, 163, 184, 1)",
                      }}
                      onChange={(e) => setFile(e.target.files)}
                    />
                  </FormControl>

                  <HStack justify={"flex-end"} width={"100%"}>
                    <Button
                      alignSelf={"flex-end"}
                      height={"40px"}
                      border={"1px solid rgba(56, 72, 87, 1)"}
                      bg={"rgba(26, 32, 40, 1)"}
                      borderRadius={"100px"}
                      padding={"0 16px"}
                      onClick={onClose}
                      _hover={{
                        bg: "rgba(0, 84, 87, 1)",
                        border: "1px solid rgba(112, 239, 222, 1)",
                      }}
                      marginTop={"60px"}
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
                      alignSelf={"flex-end"}
                      height={"40px"}
                      border={"1px solid rgba(56, 72, 87, 1)"}
                      bg={"rgba(26, 32, 40, 1)"}
                      borderRadius={"100px"}
                      padding={"0 16px"}
                      type="submit"
                      _hover={{
                        bg: "rgba(0, 84, 87, 1)",
                        border: "1px solid rgba(112, 239, 222, 1)",
                      }}
                      marginTop={"60px"}
                    >
                      <Text
                        color={"rgba(248, 250, 252, 1)"}
                        fontSize={"16px"}
                        fontWeight={"500"}
                      >
                        Добавить
                      </Text>
                    </Button>
                  </HStack>
                </VStack>
              </Form>
            )}
          </Formik>
        </ModalContent>
      </Modal>
    </>
  );
});

export default ModalAddProduct;
