import { makeAutoObservable, values } from "mobx";
import base_url from "./vars";

class pageStore {
  is_open_profile = false;
  is_open_cart = false;
  is_open_filters = false;

  all_products = [];
  user_info = {};

  selected_genre = null;
  selected_producer = null;
  min_price = null;
  max_price = null;

  filteredProducts = {};
  sort = [1, 0, 0, 0];
  search_bar = "";

  selected_header = [1, 0, 0, 0];

  genre = [
    "Новинка",
    "Одиночная игра",
    "Несколько игроков",
    "Сетевая игра",
    "Демо-версия",
    "Стратегии",
    "Приключения",
    "Экшн",
    "Ролевые (RPG)",
    "Аниме",
    "Спорт",
    "Гонки",
    "Ужасы",
    "Симуляторы",
    "Япония",
    "Вестерн",
  ];

  constructor() {
    makeAutoObservable(this);
  }

  updateOpenProfile = (new_profile) => {
    this.is_open_profile = new_profile;
  };
  updateOpenCart = (new_cart) => {
    this.is_open_cart = new_cart;
  };
  updateOpenFilters = (new_filters) => {
    this.is_open_filters = new_filters;
  };
  updateSelectedGenre = (new_genre) => {
    this.selected_genre = new_genre;
  };
  updateSelectedProducer = (new_producer) => {
    this.selected_producer = new_producer;
  };
  updateMinPrice = (new_price) => {
    this.min_price = new_price;
  };
  updateMaxPrice = (new_price) => {
    this.max_price = new_price;
  };
  updateFilteredProducts = (new_prod) => {
    this.filteredProducts = new_prod;
  };
  updateSort = (new_sort) => {
    this.sort = new_sort;
  };
  updateSearchBar = (new_bar) => {
    this.search_bar = new_bar;
  };
  updateSelectedHeader = (new_select) => {
    this.selected_header = new_select;
  };

  resetFilters = () => {
    this.updateSelectedGenre(null);
    this.updateSelectedProducer(null);
    this.updateMinPrice(null);
    this.updateMaxPrice(null);
    this.updateSearchBar("");
  };

  getAllGames = async () => {
    const response = await fetch(`${base_url}/games`, {
      method: "GET",
      headers: {
        accept: "application/json",
      },
    });
    const result = await response.json();
    this.all_products = result;
  };

  createGame = async (auth_token, name, desc, genre, price, platforms) => {
    const response = await fetch(`${base_url}/games`, {
      method: "POST",
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${auth_token}`,
      },
      body: JSON.stringify({
        name: name,
        description: desc,
        genre: genre,
        price: price,
        platforms: platforms,
        discount: 0,
      }),
    });
    if (response.ok) {
      await this.getAllGames();
    }
    const result = await response.json();
    return result;
  };

  addPhotoToGame = async (id, auth_token, formData) => {
    const response = await fetch(`${base_url}/photo/${id}`, {
      method: "POST",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${auth_token}`,
      },
      body: formData,
    });
    console.log("add photo", response);
    if (response.ok) {
      await this.getAllGames();
    }
  };

  updateGame = async (id, auth_token, values) => {
    const response = await fetch(`${base_url}/games/${id}`, {
      method: "PUT",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${auth_token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: values?.name,
        description: values?.description,
        genre: values?.genre.join(),
        price: values?.price,
        platforms: values?.platforms.join(),
      }),
    });

    if (response.ok) {
      await this.getAllGames();
    }
    return response.ok;
  };
}

export default pageStore;
