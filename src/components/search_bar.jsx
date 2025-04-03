import { Image, Input, InputGroup, InputLeftElement } from "@chakra-ui/react";

import searchIcon from "./../images/search_icon.svg";
import { useStores } from "../store/store_context";
import { observer } from "mobx-react-lite";

const SearchBar = observer(() => {
  const { pageStore } = useStores();
  return (
    <InputGroup width={"100%"}>
      <InputLeftElement>
        <Image src={searchIcon} />
      </InputLeftElement>
      <Input
        fontFamily={"Inter"}
        placeholder="Поиск по названию"
        _placeholder={{ color: "rgba(148, 163, 184, 1)" }}
        color={"rgba(248, 250, 252, 1)"}
        fontSize={"16px"}
        fontWeight={"500"}
        border={"1px solid rgba(56, 72, 87, 1)"}
        bg={"rgba(26, 32, 40, 1)"}
        value={pageStore.search_bar}
        onChange={(e) => pageStore.updateSearchBar(e.target.value)}
      />
    </InputGroup>
  );
});

export default SearchBar;
