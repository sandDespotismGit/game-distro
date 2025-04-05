import {
  Button,
  FormControl,
  FormErrorMessage,
  Input,
  Text,
  VStack,
  useToast,
} from "@chakra-ui/react";
import { Form, Formik } from "formik";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";

import useWindowDimensions from "../windowDimensions";
import { useStores } from "../../store/store_context";

const BioForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();
  const toast = useToast();
  const { width } = useWindowDimensions();
  const { userStore } = useStores();

  const addFieldMe = async (
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

  const handleSumbit = async (values, { setSubmitting }) => {
    setIsSubmitting(true);
    const ok = await addFieldMe(
      values?.firstName,
      values?.lastName,
      values?.email,
      values?.adress,
      values?.phoneNumber
    );
    if (ok) {
      toast({
        title: "Успех",
        description: "Данные обновлены",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
      navigate("/");
      setIsSubmitting(false);
      setSubmitting(false);
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

  return (
    <Formik
      initialValues={{
        firstName: "",
        lastName: "",
        phoneNumber: "",
        email: "",
        adress: "",
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
      onSubmit={handleSumbit}
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
              О себе
            </Text>
            <VStack
              gap={"10px"}
              marginTop={"12px"}
              width={
                width >= 1440 ? "363px" : ["315px", "327px", "339px", "351px"]
              }
            >
              <FormControl isInvalid={errors.firstName && touched.firstName}>
                <Input
                  fontFamily={"Inter"}
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
              <FormControl isInvalid={errors.lastName && touched.lastName}>
                <Input
                  fontFamily={"Inter"}
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
            </VStack>
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
                Завершить
              </Text>
            </Button>
          </VStack>
        </Form>
      )}
    </Formik>
  );
};

export default BioForm;
