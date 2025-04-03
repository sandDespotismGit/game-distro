import {
  Button,
  FormControl,
  FormErrorMessage,
  Input,
  Text,
  VStack,
  Fade,
  Box,
  useToast,
  HStack,
  Stack,
} from "@chakra-ui/react";
import { Form, Formik } from "formik";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";

import useWindowDimensions from "../windowDimensions";
import { useStores } from "../../store/store_context";
import { observer } from "mobx-react-lite";
import { values } from "mobx";

const AuthForm = observer(() => {
  const [typeForm, setTypeForm] = useState("login");
  const [showForm, setShowForm] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [isSeller, setIsSeller] = useState(false);

  const navigate = useNavigate();
  const toast = useToast();
  const { width } = useWindowDimensions();
  const { userStore, pageStore } = useStores();

  const toggleForm = (newType) => {
    setShowForm(false);
    setTimeout(() => {
      setTypeForm(newType);
      setShowForm(true);
    }, 300);
  };

  const register = async (login, password, isSeller) => {
    return await userStore.register(login, password, isSeller);
  };

  const login = async (login, password) => {
    return await userStore.login(login, password);
  };

  const sendRestorePassword = async (values) => {
    return await userStore.sendRestorePassword(values);
  };

  const resetPassword = async (values) => {
    return await userStore.inputCode(values);
  };

  const handleLogin = async (values, { setSubmitting }) => {
    setIsSubmitting(true);
    const ok = await login(values?.login, values?.password);
    if (ok) {
      toast({
        title: "Успешный вход",
        description: "Вы успешно вошли в систему",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
      setIsSubmitting(false);
      setSubmitting(false);
      navigate("/");
    } else {
      toast({
        title: "Ошибка входа",
        description: "Неверный логин или пароль",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
      setIsSubmitting(false);
      setSubmitting(false);
    }
  };

  const handleRegister = async (values, { setSubmitting }) => {
    setIsSubmitting(true);
    console.log(values);
    const ok = await register(values?.login, values?.password, isSeller);
    console.log("ok", ok);
    if (ok) {
      setIsSubmitting(false);
      setSubmitting(false);
      toast({
        title: "Успешная регистрация",
        description: "Вы успешно зарегистрированы",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
      navigate("/bio");
    } else {
      toast({
        title: "Ошибка регистрации",
        description: "Пользователь с таким логином уже существует",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
      setIsSubmitting(false);
      setSubmitting(false);
    }
  };

  const handleResetPassword = async (values, { setSubmitting }) => {
    setIsSubmitting(true);
    console.log("data rec", values);
    const ok = await sendRestorePassword(values);
    if (ok) {
      setIsSubmitting(false);
      setSubmitting(false);
      toast({
        title: "",
        description: "Код восстановления отправлен на Вашу почту",
        status: "info",
        duration: 2000,
        isClosable: true,
      });
      toggleForm("inputCode");
    } else {
      toast({
        title: "Ошибка",
        description: "Ошибка при отправке кода восстановления",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
      setIsSubmitting(false);
      setSubmitting(false);
    }
  };

  const handleResetCode = async (values, { setSubmitting }) => {
    // setIsSubmitting(true);
    const ok = await resetPassword(values);
    if (ok) {
      toast({
        title: "Успех",
        description: "Пароль изменён",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
      toggleForm("login");
    } else {
      toast({
        title: "Ошибка",
        description: "Ошибка при изменении пароля",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
    }
  };

  return (
    <Box>
      <Fade in={showForm} unmountOnExit>
        {typeForm == "login" ? (
          <Formik
            initialValues={{
              login: "",
              password: "",
            }}
            validationSchema={Yup.object({
              login: Yup.string().required("Обязательное поле"),
              password: Yup.string().required("Обязательное поле"),
            })}
            onSubmit={handleLogin}
          >
            {({ values, errors, touched, handleChange, handleBlur }) => (
              <Form>
                {/* {console.log(values)}  */}
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
                    Вход
                  </Text>
                  <VStack
                    gap={"8px"}
                    marginTop={"12px"}
                    width={
                      width >= 1440
                        ? "363px"
                        : ["315px", "327px", "339px", "351px"]
                    }
                  >
                    <FormControl isInvalid={errors.login && touched.login}>
                      <Input
                        fontFamily={"Inter"}
                        placeholder="Логин"
                        name="login"
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
                        {errors.login}
                      </FormErrorMessage>
                    </FormControl>
                    <FormControl
                      isInvalid={errors.password && touched.password}
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
                    <Text
                      color={"rgba(248, 250, 252, 1)"}
                      borderBottom={"1px solid rgba(248, 250, 252, 1)"}
                      fontSize={"14px"}
                      fontWeight={"500"}
                      alignSelf={"flex-end"}
                      cursor={"pointer"}
                      onClick={() => toggleForm("reset")}
                    >
                      Забыли пароль?
                    </Text>
                  </VStack>
                  <Button
                    type="submit"
                    background={"rgba(14, 18, 22, 1)"}
                    border={"1px solid rgba(56, 72, 87, 1)"}
                    _hover={{
                      bg: "rgba(0, 84, 87, 1)",
                    }}
                    isLoading={isSubmitting}
                    loadingText="Вход..."
                  >
                    <Text
                      color={"rgba(248, 250, 252, 1)"}
                      fontSize={"16px"}
                      fontWeight={"500"}
                    >
                      Войти
                    </Text>
                  </Button>
                  <Text color={"rgba(248, 250, 252, 1)"}>
                    Нет аккаунта?{" "}
                    <span
                      style={{
                        borderBottom: "1px solid rgba(248, 250, 252, 1)",
                        cursor: "pointer",
                      }}
                      onClick={() => toggleForm("registration")}
                    >
                      Регистрация
                    </span>
                  </Text>
                </VStack>
              </Form>
            )}
          </Formik>
        ) : typeForm == "registration" ? (
          <Formik
            initialValues={{
              login: "",
              password: "",
              confirmPassword: "",
            }}
            validationSchema={Yup.object({
              login: Yup.string()
                .required("Обязательное поле")
                .min(3, "Поле должно содержать минимум 3 символа"),
              password: Yup.string()
                .required("Обязательное поле")
                .min(6, "Поле должно содержать минимум 6 символов"),
              confirmPassword: Yup.string()
                .required("Повторите пароль")
                .oneOf([Yup.ref("password"), null], "Пароли должны совпадать"),
            })}
            onSubmit={handleRegister}
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
                    Регистрация
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
                    <HStack
                      border={"1px solid rgba(56, 72, 87, 1)"}
                      borderRadius={"8px"}
                      height={"60px"}
                      width={"100%"}
                      justify={"center"}
                      gap={"8px"}
                      align={"center"}
                      color={"rgba(248, 250, 252, 1)"}
                      fontWeight={"500"}
                      fontSize={"16px"}
                      position={"relative"}
                    >
                      <Stack
                        position={"absolute"}
                        bg={"rgba(56, 72, 87, 1)"}
                        borderRadius={"8px"}
                        width={"50%"}
                        height={"60px"}
                        left={!isSeller ? 0 : "50%"}
                        transition={"left 0.3s ease"}
                      />
                      <VStack
                        width={"100%"}
                        padding={"0 10px"}
                        zIndex={2}
                        cursor={"pointer"}
                        onClick={() => setIsSeller(false)}
                        height={"60px"}
                        justify={"center"}
                      >
                        <Text textAlign={"center"}>Я покупатель</Text>
                      </VStack>
                      <VStack
                        width={"100%"}
                        padding={"0 10px"}
                        cursor={"pointer"}
                        onClick={() => setIsSeller(true)}
                        zIndex={2}
                        height={"60px"}
                        justify={"center"}
                      >
                        <Text textAlign={"center"}>Я продавец</Text>
                      </VStack>
                    </HStack>
                    <FormControl isInvalid={errors.login && touched.login}>
                      <Input
                        fontFamily={"Inter"}
                        placeholder="Логин"
                        name="login"
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
                        {errors.login}
                      </FormErrorMessage>
                    </FormControl>
                    <FormControl
                      isInvalid={errors.password && touched.password}
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
                        placeholder="Подтвердите пароль"
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
                  <Button
                    type="submit"
                    background={"rgba(14, 18, 22, 1)"}
                    border={"1px solid rgba(56, 72, 87, 1)"}
                    _hover={{
                      bg: "rgba(0, 84, 87, 1)",
                    }}
                    isLoading={isSubmitting}
                    loadingText="Регистрация..."
                  >
                    <Text
                      color={"rgba(248, 250, 252, 1)"}
                      fontSize={"16px"}
                      fontWeight={"500"}
                    >
                      Продолжить
                    </Text>
                  </Button>
                  <Text color={"rgba(248, 250, 252, 1)"}>
                    Есть аккаунт?{" "}
                    <span
                      style={{
                        borderBottom: "1px solid rgba(248, 250, 252, 1)",
                        cursor: "pointer",
                      }}
                      onClick={() => toggleForm("login")}
                    >
                      Вход
                    </span>
                  </Text>
                </VStack>
              </Form>
            )}
          </Formik>
        ) : typeForm == "reset" ? (
          <Formik
            initialValues={{
              login: "",
            }}
            validationSchema={Yup.object({
              login: Yup.string()
                .required("Обязательное поле")
                .min(3, "Поле должно содержать минимум 3 символа"),
            })}
            onSubmit={handleResetPassword}
          >
            {({ values, errors, touched, handleChange, handleBlur }) => (
              <Form>
                {console.log(values)}
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
                    Восстановление пароля
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
                    <FormControl isInvalid={errors.login && touched.login}>
                      <Input
                        fontFamily={"Inter"}
                        placeholder="Логин"
                        name="login"
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
                        {errors.login}
                      </FormErrorMessage>
                    </FormControl>
                  </VStack>
                  <HStack>
                    <Button
                      background={"rgba(14, 18, 22, 1)"}
                      border={"1px solid rgba(56, 72, 87, 1)"}
                      _hover={{
                        bg: "rgba(0, 84, 87, 1)",
                      }}
                      onClick={() => toggleForm("login")}
                    >
                      <Text
                        color={"rgba(248, 250, 252, 1)"}
                        fontSize={"16px"}
                        fontWeight={"500"}
                      >
                        Отмена
                      </Text>
                    </Button>
                    <Button
                      type="submit"
                      background={"rgba(14, 18, 22, 1)"}
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
                        Продолжить
                      </Text>
                    </Button>
                  </HStack>
                </VStack>
              </Form>
            )}
          </Formik>
        ) : (
          <Formik
            initialValues={{
              resetCode: "",
              password: "",
              confirmPassword: "",
            }}
            validationSchema={Yup.object({
              resetCode: Yup.string().required("Обязательное поле"),
              password: Yup.string()
                .required("Обязательное поле")
                .min(6, "Поле должно содержать минимум 6 символов"),
              confirmPassword: Yup.string()
                .required("Повторите пароль")
                .oneOf([Yup.ref("password"), null], "Пароли должны совпадать"),
            })}
            onSubmit={handleResetCode}
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
                    Восстановление пароля
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
                    <Text
                      color={"rgba(248, 250, 252, 1)"}
                      fontWeight={"500"}
                      fontSize={"16px"}
                    >
                      Код подтверждения отправлен на Вашу почту (может
                      находиться в разделе спам)
                    </Text>
                    <FormControl
                      isInvalid={errors.resetCode && touched.resetCode}
                    >
                      <Input
                        fontFamily={"Inter"}
                        placeholder="Код подтверждения"
                        name="resetCode"
                        type="resetCode"
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
                        {errors.resetCode}
                      </FormErrorMessage>
                    </FormControl>
                    <FormControl
                      marginTop={"20px"}
                      isInvalid={errors.password && touched.password}
                    >
                      <Input
                        fontFamily={"Inter"}
                        placeholder="Новый пароль"
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
                        placeholder="Подтвердите пароль"
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
                      type="submit"
                      background={"rgba(14, 18, 22, 1)"}
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
                        Продолжить
                      </Text>
                    </Button>
                  </HStack>
                </VStack>
              </Form>
            )}
          </Formik>
        )}
      </Fade>
    </Box>
  );
});

export default AuthForm;
