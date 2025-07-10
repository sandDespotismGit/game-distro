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

import { Form, Formik } from "formik";
import * as Yup from "yup";
import { observer } from "mobx-react-lite";
import { useState } from "react";
import { useStores } from "../store/store_context";

const ModalEditProduct = observer(({ obj = {} }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [file, setFile] = useState("");
  const [bin, setBin] = useState("");
  const { pageStore, userStore } = useStores();
  const toast = useToast();

  const updateGame = async (values) => {
    return await pageStore.updateGame(obj?.id, userStore.auth_token, values);
  };

  console.log(bin);

  const addPhoto = async (id, image) => {
    const formData = new FormData();
    formData.append("image", image);
    await pageStore.addPhotoToGame(id, userStore.auth_token, formData);
  };

  const addBin = async (id, bin) => {
    const formData = new FormData();
    formData.append("bins", bin);
    await pageStore.addBinToGame(id, userStore.auth_token, formData);
  };

  const handleUpdateGame = async (values) => {
    const result = await updateGame(values);
    if (result) {
      toast({
        title: "Успех",
        description: "Данные обновлены",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
      await addPhoto(obj?.id, file[0]);
      await addBin(obj?.id, bin[0]);
      setFile("");
      setBin("");
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
        onClick={onOpen}
        alignSelf={"center"}
        height={"40px"}
        border={"1px solid rgba(56, 72, 87, 1)"}
        bg={"rgba(26, 32, 40, 1)"}
        borderRadius={"100px"}
        padding={"0 16px"}
        _hover={{
          bg: "rgba(0, 84, 87, 1)",
          border: "1px solid rgba(112, 239, 222, 1)",
        }}
      >
        <Text
          color={"rgba(248, 250, 252, 1)"}
          fontSize={"16px"}
          fontWeight={"500"}
        >
          Edit
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
              name: obj?.name,
              genre: obj?.genre.split(","),
              platforms: obj?.platforms.split(","),
              description: obj?.description,
              price: obj?.price,
              discount: obj?.discount,
              discount: obj?.discount,
            }}
            validationSchema={Yup.object({
              name: Yup.string().required("Обязательное поле"),
              genre: Yup.array().min(1, "Выберите хотя бы одно поле"),
              platforms: Yup.array().min(1, "Выберите хотя бы одно поле"),
              description: Yup.string().required("Обязательное поле"),
              price: Yup.number().required("Обязательное поле"),
              discount: Yup.number()
                .min(0)
                .max(100)
                .required("Введите скидку, ноль если скидки нет"),
              discount: Yup.number()
                .min(0)
                .max(100)
                .required("Введите скидку, ноль если скидки нет"),
            })}
            onSubmit={handleUpdateGame}
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
                    <Text
                      fontWeight={"500"}
                      color={"rgba(248, 250, 252, 1)"}
                      onClick={() => console.log(obj)}
                    >
                      Название
                    </Text>
                    <Input
                      marginTop={"4px"}
                      fontFamily={"Inter"}
                      placeholder="Название"
                      name="name"
                      value={values?.name}
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
                      value={values?.platforms}
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
                      value={values?.description}
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
                      value={values?.price}
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
                  <FormControl isInvalid={errors.discount && touched.discount}>
                    <Text fontWeight={"500"} color={"rgba(248, 250, 252, 1)"}>
                      Скидка
                    </Text>
                    <Input
                      value={values?.discount}
                      marginTop={"4px"}
                      fontFamily={"Inter"}
                      placeholder="Скидка"
                      name="discount"
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
                      {errors.discount}
                    </FormErrorMessage>
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
                      height={"40px"}
                      width={"max-content"}
                      background={"rgba(14, 18, 22, 1)"}
                      border={"none"}
                      borderRadius={"8px"}
                      color={"rgba(248, 250, 252, 1)"}
                      _placeholder={{
                        color: "rgba(148, 163, 184, 1)",
                      }}
                      onChange={(e) => setFile(e.target.files)}
                    />
                  </FormControl>

                  <FormControl>
                    <Text fontWeight={"500"} color={"rgba(248, 250, 252, 1)"}>
                      Установочный файл
                    </Text>
                    <Input
                      marginTop={"4px"}
                      fontFamily={"Inter"}
                      type="file"
                      accept="application/x-msdownload"
                      height={"40px"}
                      width={"max-content"}
                      background={"rgba(14, 18, 22, 1)"}
                      border={"none"}
                      borderRadius={"8px"}
                      color={"rgba(248, 250, 252, 1)"}
                      _placeholder={{
                        color: "rgba(148, 163, 184, 1)",
                      }}
                      onChange={(e) => setBin(e.target.files)}
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
                        Обновить
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

export default ModalEditProduct;
