import {
  Button,
  Fade,
  FormControl,
  FormErrorMessage,
  HStack,
  Image,
  Input,
  Stack,
  Text,
  VStack,
  useToast,
} from "@chakra-ui/react";
import { Field, Form, Formik } from "formik";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";

import useWindowDimensions from "../windowDimensions";
import ModalDeleteAccount from "../modal_delete_account";
import { useStores } from "../../store/store_context";

import eyeHideIcon from "./../../images/eye_no.svg";
import eyeShowIcon from "./../../images/eye_yes.svg";
import { observer } from "mobx-react-lite";

const EditForm = observer(() => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [typeEdit, setTypeEdit] = useState("bio");
  const [showForm, setShowForm] = useState(true);

  const [showCardNumber, setshowCardNumber] = useState(false);
  const [showCardDate, setShowCardDate] = useState(false);
  const [showCardCvv, setShowCardCvv] = useState(false);

  const navigate = useNavigate();
  const toast = useToast();
  const { width } = useWindowDimensions();
  const { userStore } = useStores();

  const resetCardShow = () => {
    setshowCardNumber(false);
    setShowCardDate(false);
    setShowCardCvv(false);
  };

  const addFieldsMe = async (
    firstName,
    lastName,
    email,
    address,
    phoneNumber
  ) => {
    return await userStore.addFieldsMe(
      firstName,
      lastName,
      email,
      address,
      phoneNumber
    );
  };

  const addCard = async (cardNumber, cvvCode, dateEnd) => {
    return await userStore.addCard(cardNumber, cvvCode, dateEnd);
  };

  const handleSumbitBio = async (values, { setSubmitting }) => {
    setIsSubmitting(true);
    const ok = await addFieldsMe(
      values?.firstName,
      values?.lastName,
      values?.email,
      values?.adress,
      values?.phoneNumber
    );
    if (ok) {
      toast({
        description: "Данные обновлены",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
      setIsSubmitting(false);
      setSubmitting(false);
      navigate("/");
    } else {
      toast({
        title: "Ошибка",
        description: "Ошибка",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
      setIsSubmitting(false);
      setSubmitting(false);
    }
  };

  const handleSumbitAddCard = async (values, { setSubmitting }) => {
    setIsSubmitting(true);
    const ok = await addCard(
      values?.cardNumber,
      values?.cvvCode,
      values?.dateEnd
    );
    if (ok) {
      toast({
        title: "Успех",
        description: "Карта добавлена",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
      setIsSubmitting(false);
      setSubmitting(false);
      toggleForm("cards");
    } else {
      toast({
        title: "Ошибка",
        description: "Ошибка",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
      setIsSubmitting(false);
      setSubmitting(false);
    }
  };

  const toggleForm = (newType) => {
    setShowForm(false);
    setTimeout(() => {
      setTypeEdit(newType);
      setShowForm(true);
    }, 300);
  };

  const formatDateInput = (value) => {
    let formattedValue = value.replace(/\D/g, ""); // Удаляем все нецифровые символы

    if (formattedValue.length > 2) {
      formattedValue =
        formattedValue.slice(0, 2) + "/" + formattedValue.slice(2, 4);
    } else if (formattedValue.length === 2) {
      formattedValue += "/";
    }
    return formattedValue;
  };

  return (
    <>
      <Fade in={showForm} unmountOnExit>
        {typeEdit == "bio" ? (
          <Formik
            initialValues={{
              firstName: userStore.user_info?.firstname || "",
              lastName: userStore.user_info?.lastname || "",
              phoneNumber: userStore.user_info?.number || "",
              email: userStore.user_info?.email || "",
              adress: userStore.user_info?.address || "",
            }}
            validationSchema={Yup.object({
              firstName: Yup.string()
                .required("Обязательное поле")
                .min(2, "Поле должно содержать минимум 2 символа"),
              lastName: Yup.string()
                .required("Обязательное поле")
                .min(2, "Поле должно содержать минимум 2 символа"),
              phoneNumber: Yup.string()
                .required("Обязательное поле")
                .matches(
                  /^\+?(\d{1,3})?[- .]?\(?(?:\d{2,3})\)?[- .]?\d\d\d[- .]?\d\d\d\d$/,
                  "Некорректное значение"
                ),
              email: Yup.string()
                .required("Обязательное поле")
                .matches(
                  /^[A-Z0-9._%+-]+@[A-Z0-9-]+.+.[A-Z]{2,4}$/i,
                  "Некорректное значение"
                ),
              adress: Yup.string().required("Обязательное поле"),
            })}
            onSubmit={handleSumbitBio}
          >
            {({ values, errors, touched, handleChange, handleBlur }) => (
              <Form>
                <VStack
                  width={
                    width >= 1440
                      ? "578px"
                      : ["363px", "406px", "449px", "492px", "535px"]
                  }
                  height={"auto"}
                  padding={"12px"}
                  borderRadius={"8px"}
                  border={"1px solid rgba(56, 72, 87, 1)"}
                  bg={"rgba(14, 18, 22, 1)"}
                >
                  <Text
                    color={"rgba(248, 250, 252, 1)"}
                    fontSize={"20px"}
                    fontWeight={"600"}
                  >
                    Редактирование профиля
                  </Text>
                  <VStack
                    gap={"10px"}
                    marginTop={"12px"}
                    width={
                      width >= 1440
                        ? "363px"
                        : ["315px", "327px", "339px", "351px"]
                    }
                  >
                    <FormControl
                      isInvalid={errors.firstName && touched.firstName}
                    >
                      <Input
                        fontFamily={"Inter"}
                        value={values.firstName}
                        placeholder="Имя"
                        name="firstName"
                        height={"40px"}
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
                        {errors.firstName}
                      </FormErrorMessage>
                    </FormControl>
                    <FormControl
                      isInvalid={errors.lastName && touched.lastName}
                    >
                      <Input
                        fontFamily={"Inter"}
                        value={values.lastName}
                        placeholder="Фамилия"
                        name="lastName"
                        height={"40px"}
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
                        {errors.lastName}
                      </FormErrorMessage>
                    </FormControl>
                    <FormControl
                      isInvalid={errors.phoneNumber && touched.phoneNumber}
                    >
                      <Input
                        fontFamily={"Inter"}
                        value={values.phoneNumber}
                        placeholder="Номер телефона"
                        name="phoneNumber"
                        height={"40px"}
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
                        {errors.phoneNumber}
                      </FormErrorMessage>
                    </FormControl>
                    <FormControl isInvalid={errors.email && touched.email}>
                      <Input
                        fontFamily={"Inter"}
                        value={values.email}
                        placeholder="Электронная почта"
                        name="email"
                        type="email"
                        height={"40px"}
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
                        {errors.email}
                      </FormErrorMessage>
                    </FormControl>
                    <FormControl isInvalid={errors.adress && touched.adress}>
                      <Input
                        fontFamily={"Inter"}
                        value={values.adress}
                        placeholder="Физический адрес"
                        name="adress"
                        height={"40px"}
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
                        {errors.adress}
                      </FormErrorMessage>
                    </FormControl>
                    <HStack>
                      <Button
                        width={"100%"}
                        bg={"rgba(26, 32, 40, 1)"}
                        border={"1px solid rgba(56, 72, 87, 1)"}
                        borderRadius={"8px"}
                        _hover={{
                          bg: "rgba(0, 84, 87, 1)",
                        }}
                      >
                        <Text
                          color={"rgba(248, 250, 252, 1)"}
                          fontWeight={"500"}
                          onClick={() =>
                            toast({
                              description:
                                "Чтобы сменить пароль, воспользуйтесь восстановлением пароля (забыли пароль?) на странице входа в аккаунт",
                              status: "info",
                              duration: "2000",
                              isClosable: true,
                            })
                          }
                        >
                          Сменить пароль
                        </Text>
                      </Button>
                      {!userStore.user_info?.is_seller && (
                        <Button
                          width={"100%"}
                          bg={"rgba(26, 32, 40, 1)"}
                          border={"1px solid rgba(56, 72, 87, 1)"}
                          borderRadius={"8px"}
                          _hover={{
                            bg: "rgba(0, 84, 87, 1)",
                          }}
                        >
                          <Text
                            color={"rgba(248, 250, 252, 1)"}
                            fontWeight={"500"}
                            onClick={() => toggleForm("cards")}
                          >
                            Привязанная карта
                          </Text>
                        </Button>
                      )}
                    </HStack>
                  </VStack>
                  <HStack>
                    <Button
                      onClick={() => navigate("/")}
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
                      isLoading={isSubmitting}
                      loadingText="Загрузка..."
                    >
                      <Text
                        color={"rgba(248, 250, 252, 1)"}
                        fontSize={"16px"}
                        fontWeight={"500"}
                      >
                        Подтвердить
                      </Text>
                    </Button>
                  </HStack>
                  <ModalDeleteAccount />
                </VStack>
              </Form>
            )}
          </Formik>
        ) : typeEdit == "password" ? (
          <Formik
            initialValues={{
              password: "",
              confirmPassword: "",
            }}
            validationSchema={Yup.object({
              password: Yup.string()
                .required("Обязательное поле")
                .min(6, "Поле должно содержать минимум 6 символов"),
              confirmPassword: Yup.string()
                .required("Повторите пароль")
                .oneOf([Yup.ref("password"), null], "Пароли должны совпадать"),
            })}
            // onSubmit={handleSumbit}
          >
            {({ errors, touched, handleChange, handleBlur }) => (
              <Form>
                <VStack
                  width={
                    width >= 1440
                      ? "578px"
                      : ["363px", "406px", "449px", "492px", "535px"]
                  }
                  height={"auto"}
                  padding={"12px"}
                  borderRadius={"8px"}
                  border={"1px solid rgba(56, 72, 87, 1)"}
                  bg={"rgba(14, 18, 22, 1)"}
                >
                  <Text
                    color={"rgba(248, 250, 252, 1)"}
                    fontSize={"20px"}
                    fontWeight={"600"}
                  >
                    Смена пароля
                  </Text>
                  <VStack
                    gap={"10px"}
                    marginTop={"12px"}
                    width={
                      width >= 1440
                        ? "363px"
                        : ["315px", "327px", "339px", "351px"]
                    }
                  >
                    <FormControl
                      isInvalid={errors.password && touched.firstName}
                    >
                      <Input
                        fontFamily={"Inter"}
                        placeholder="Пароль"
                        name="password"
                        type="password"
                        height={"40px"}
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
                        {errors.password}
                      </FormErrorMessage>
                    </FormControl>
                    <FormControl
                      isInvalid={
                        errors.confirmPassword && touched.confirmPassword
                      }
                    >
                      <Input
                        fontFamily={"Inter"}
                        placeholder="Повторите пароль"
                        name="confirmPassword"
                        type="password"
                        height={"40px"}
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
                        {errors.confirmPassword}
                      </FormErrorMessage>
                    </FormControl>
                  </VStack>
                  <HStack>
                    <Button
                      onClick={() => toggleForm("bio")}
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
                      isLoading={isSubmitting}
                      loadingText="Загрузка..."
                    >
                      <Text
                        color={"rgba(248, 250, 252, 1)"}
                        fontSize={"16px"}
                        fontWeight={"500"}
                      >
                        Подтвердить
                      </Text>
                    </Button>
                  </HStack>
                </VStack>
              </Form>
            )}
          </Formik>
        ) : typeEdit == "cards" ? (
          <VStack
            width={
              width >= 1440
                ? "578px"
                : ["363px", "406px", "449px", "492px", "535px"]
            }
            height={"auto"}
            padding={"12px"}
            borderRadius={"8px"}
            border={"1px solid rgba(56, 72, 87, 1)"}
            bg={"rgba(14, 18, 22, 1)"}
          >
            <Text
              color={"rgba(248, 250, 252, 1)"}
              fontSize={"20px"}
              fontWeight={"600"}
            >
              Привязанная карта
            </Text>
            <VStack
              marginTop={"8px"}
              width={
                width >= 1440 ? "363px" : ["315px", "327px", "339px", "351px"]
              }
            >
              {userStore.user_info?.cards?.length == 0 ? (
                <Text
                  color={"rgba(248, 250, 252, 1)"}
                  // fontSize={"16px"}
                  fontWeight={"500"}
                >
                  Карта не привязана
                </Text>
              ) : (
                <>
                  <VStack
                    padding={"10px 10px 20px 10px"}
                    border={"1px solid rgba(56, 72, 87, 1)"}
                    borderRadius={"8px"}
                    width={"315px"}
                    bg={"rgba(26, 32, 40, 1)"}
                    align={"flex-start"}
                  >
                    <Text
                      color={"rgba(248, 250, 252, 1)"}
                      fontWeight={"400"}
                      fontSize={"14px"}
                    >
                      Номер карты
                    </Text>

                    <HStack
                      height={"40px"}
                      background={"rgba(14, 18, 22, 1)"}
                      border={"1px solid rgba(56, 72, 87, 1)"}
                      borderRadius={"8px"}
                      color={"rgba(248, 250, 252, 1)"}
                      justify={"flex-start"}
                      width={"100%"}
                      padding={"0 10px"}
                      justifyContent={"space-between"}
                    >
                      <Text>
                        {showCardNumber
                          ? userStore.user_info?.cards[0]?.number
                          : "************"}
                      </Text>
                      <Stack
                        bg={"white"}
                        borderRadius={"100px"}
                        padding={"4px"}
                        cursor={"pointer"}
                        onClick={() => setshowCardNumber(!showCardNumber)}
                      >
                        <Image
                          src={showCardNumber ? eyeHideIcon : eyeShowIcon}
                        />
                      </Stack>
                    </HStack>

                    <HStack
                      justify={"space-between"}
                      gap={"8px"}
                      width={"100%"}
                    >
                      <VStack align={"flex-start"} gap={"4px"} width={"100%"}>
                        <Text
                          color={"rgba(248, 250, 252, 1)"}
                          fontWeight={"400"}
                          fontSize={"14px"}
                        >
                          Срок годности
                        </Text>
                        <HStack
                          height={"40px"}
                          background={"rgba(14, 18, 22, 1)"}
                          border={"1px solid rgba(56, 72, 87, 1)"}
                          borderRadius={"8px"}
                          color={"rgba(248, 250, 252, 1)"}
                          justify={"flex-start"}
                          width={"100%"}
                          padding={"0 10px"}
                          justifyContent={"space-between"}
                        >
                          <Text>
                            {showCardDate
                              ? userStore.user_info?.cards[0]?.date
                              : "*****"}
                          </Text>
                          <Stack
                            bg={"white"}
                            borderRadius={"100px"}
                            padding={"4px"}
                            cursor={"pointer"}
                            onClick={() => setShowCardDate(!showCardDate)}
                          >
                            <Image
                              src={showCardDate ? eyeHideIcon : eyeShowIcon}
                            />
                          </Stack>
                        </HStack>
                      </VStack>
                      <VStack align={"flex-start"} gap={"4px"} width={"100%"}>
                        <Text
                          color={"rgba(248, 250, 252, 1)"}
                          fontWeight={"400"}
                          fontSize={"14px"}
                        >
                          CVV
                        </Text>
                        <HStack
                          height={"40px"}
                          background={"rgba(14, 18, 22, 1)"}
                          border={"1px solid rgba(56, 72, 87, 1)"}
                          borderRadius={"8px"}
                          color={"rgba(248, 250, 252, 1)"}
                          justify={"flex-start"}
                          width={"100%"}
                          padding={"0 10px"}
                          justifyContent={"space-between"}
                        >
                          <Text>
                            {showCardCvv
                              ? userStore.user_info?.cards[0]?.cvv
                              : "***"}
                          </Text>
                          <Stack
                            bg={"white"}
                            borderRadius={"100px"}
                            padding={"4px"}
                            cursor={"pointer"}
                            onClick={() => setShowCardCvv(!showCardCvv)}
                          >
                            <Image
                              src={showCardCvv ? eyeHideIcon : eyeShowIcon}
                            />
                          </Stack>
                        </HStack>
                      </VStack>
                    </HStack>
                  </VStack>
                </>
              )}
            </VStack>
            <HStack>
              <Button
                onClick={() => {
                  toggleForm("bio");
                  resetCardShow();
                }}
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
                  Назад
                </Text>
              </Button>
              {userStore.user_info?.cards?.length == 0 && (
                <Button
                  onClick={() => toggleForm("addCard")}
                  bg={"rgba(26, 32, 40, 1)"}
                  border={"1px solid rgba(56, 72, 87, 1)"}
                  _hover={{
                    bg: "rgba(0, 84, 87, 1)",
                  }}
                >
                  <Text color={"rgba(248, 250, 252, 1)"} fontWeight={"500"}>
                    Привязать карту
                  </Text>
                </Button>
              )}
            </HStack>
          </VStack>
        ) : (
          <Formik
            initialValues={{
              cardNumber: "",
              dateEnd: "",
              cvvCode: "",
            }}
            validationSchema={Yup.object({
              cardNumber: Yup.string()
                .required("Обязательное поле")
                .min(12, "Поле должно содержать минимум 12 символов")
                .max(12, "Поле должно содержать максимум 12 символов"),
              dateEnd: Yup.string()
                .required("required")
                .matches(
                  /^(0[1-9]|1[0-2])\/\d{2}$/, // Проверка формата MM/YY
                  "MM/YY"
                ),
              cvvCode: Yup.string()
                .required("required")
                .min(3, "min 3")
                .max(3, "max 3"),
            })}
            onSubmit={handleSumbitAddCard}
          >
            {({ errors, touched, handleChange, handleBlur }) => (
              <Form>
                <VStack
                  width={
                    width >= 1440
                      ? "578px"
                      : ["363px", "406px", "449px", "492px", "535px"]
                  }
                  height={"auto"}
                  padding={"12px"}
                  borderRadius={"8px"}
                  border={"1px solid rgba(56, 72, 87, 1)"}
                  bg={"rgba(14, 18, 22, 1)"}
                >
                  <Text
                    color={"rgba(248, 250, 252, 1)"}
                    fontSize={"20px"}
                    fontWeight={"600"}
                  >
                    Привязка карты
                  </Text>
                  <VStack
                    gap={"10px"}
                    marginTop={"12px"}
                    width={
                      width >= 1440
                        ? "363px"
                        : ["315px", "327px", "339px", "351px"]
                    }
                  >
                    <VStack
                      padding={"10px 10px 20px 10px"}
                      border={"1px solid rgba(56, 72, 87, 1)"}
                      borderRadius={"8px"}
                      width={"315px"}
                      bg={"rgba(26, 32, 40, 1)"}
                      align={"flex-start"}
                    >
                      <Text
                        color={"rgba(248, 250, 252, 1)"}
                        fontWeight={"400"}
                        fontSize={"14px"}
                      >
                        Номер карты
                      </Text>

                      <FormControl
                        isInvalid={errors.cardNumber && touched.cardNumber}
                      >
                        <Input
                          fontFamily={"Inter"}
                          placeholder="Номер карты"
                          name="cardNumber"
                          id="cardNumber"
                          height={"40px"}
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
                          {errors.cardNumber}
                        </FormErrorMessage>
                      </FormControl>
                      <HStack justify={"space-between"}>
                        <VStack align={"flex-start"} gap={"4px"}>
                          <Text
                            color={"rgba(248, 250, 252, 1)"}
                            fontWeight={"400"}
                            fontSize={"14px"}
                          >
                            Срок годности
                          </Text>
                          <Field name="dateEnd">
                            {({ field, form }) => (
                              <FormControl
                                position={"relative"}
                                isInvalid={errors.dateEnd && touched.dateEnd}
                              >
                                <Input
                                  {...field}
                                  fontFamily={"Inter"}
                                  placeholder="MM/YY"
                                  name="dateEnd"
                                  id="dateEnd"
                                  height={"40px"}
                                  background={"rgba(14, 18, 22, 1)"}
                                  border={"1px solid rgba(56, 72, 87, 1)"}
                                  borderRadius={"8px"}
                                  color={"rgba(248, 250, 252, 1)"}
                                  _placeholder={{
                                    color: "rgba(148, 163, 184, 1)",
                                  }}
                                  onChange={(e) => {
                                    const formattedValue = formatDateInput(
                                      e.target.value
                                    );
                                    form.setFieldValue(
                                      "dateEnd",
                                      formattedValue
                                    );
                                  }}
                                  onBlur={handleBlur}
                                />
                                <FormErrorMessage
                                  position={"absolute"}
                                  margin={"2px"}
                                  fontSize={"12px"}
                                >
                                  {errors.dateEnd}
                                </FormErrorMessage>
                              </FormControl>
                            )}
                          </Field>
                        </VStack>
                        <VStack align={"flex-start"} gap={"4px"}>
                          <Text
                            color={"rgba(248, 250, 252, 1)"}
                            fontWeight={"400"}
                            fontSize={"14px"}
                          >
                            CVV
                          </Text>
                          <FormControl
                            position={"relative"}
                            isInvalid={errors.cvvCode && touched.cvvCode}
                          >
                            <Input
                              fontFamily={"Inter"}
                              placeholder="CVV"
                              name="cvvCode"
                              id="cvvCode"
                              height={"40px"}
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
                            <FormErrorMessage
                              position={"absolute"}
                              margin={"2px"}
                              fontSize={"12px"}
                            >
                              {errors.cvvCode}
                            </FormErrorMessage>
                          </FormControl>
                        </VStack>
                      </HStack>
                    </VStack>
                  </VStack>
                  <HStack>
                    <Button
                      onClick={() => toggleForm("cards")}
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
                      isLoading={isSubmitting}
                      loadingText="Загрузка..."
                    >
                      <Text
                        color={"rgba(248, 250, 252, 1)"}
                        fontSize={"16px"}
                        fontWeight={"500"}
                      >
                        Подтвердить
                      </Text>
                    </Button>
                  </HStack>
                </VStack>
              </Form>
            )}
          </Formik>
        )}
      </Fade>
    </>
  );
});

export default EditForm;
