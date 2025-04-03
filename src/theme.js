import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
  components: {
    Text: {
      baseStyle: {
        fontFamily: "Inter",
      },
    },
    Input: {
      baseStyle: {
        fontFamily: "Inter",
      },
    },
  },
});

export default theme;
