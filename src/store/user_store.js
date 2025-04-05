import { makeAutoObservable } from "mobx";
import base_url from "./vars";
import Cookies from "js-cookie";

class userStore {
  auth_token = "";
  user_info = {};
  cart = [];

  boughts = [];
  temp_data = {};

  constructor() {
    makeAutoObservable(this);
  }
  updateToken = (new_token) => {
    this.auth_token = new_token;
  };
  resetUser = () => {
    this.auth_token = "";
    this.user_info = {};
    this.cart = [];
  };

  updateCart = (new_cart) => {
    this.cart = new_cart;
  };

  getMe = async (token) => {
    const response = await fetch(`${base_url}/me`, {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    const result = await response.json();
    this.user_info = result;
    return response.ok;
  };

  register = async (username, password, is_seller) => {
    const response = await fetch(`${base_url}/register`, {
      method: "POST",
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: username,
        password: password,
        is_seller: is_seller,
      }),
    });

    const result = await response.json();
    this.auth_token = result.access_token;
    if (response.ok) {
      await this.getMe(this.auth_token);
      if (this.cart?.length != 0) {
        this.cart?.map(async (item) => await this.addToCart(item?.id));
      }
      await this.getCart(this.auth_token);
      await this.getBought(this.auth_token);
    }
    return response.ok;
  };

  login = async (username, password) => {
    const response = await fetch(`${base_url}/login`, {
      method: "POST",
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: username,
        password: password,
      }),
    });

    if (response.ok) {
      const result = await response.json();
      this.auth_token = result.access_token;
      Cookies.set("auth_token", result.access_token, {
        expires: 1, // Срок жизни - 1 день
        secure: false, // Только HTTPS (если не localhost)
        sameSite: "strict", // Защита от CSRF
      });

      await this.getMe(this.auth_token);
      await this.getCart(this.auth_token);
      await this.getBought(this.auth_token);
    }

    return response.ok;
  };

  addFieldsMe = async (first_name, last_name, email, address, phone_number) => {
    const response = await fetch(`${base_url}/me`, {
      method: "POST",
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.auth_token}`,
      },
      body: JSON.stringify({
        username: this.user_info?.username,
        firstname: first_name,
        lastname: last_name,
        email: email,
        country: "Russia",
        address: address,
        number: phone_number,
      }),
    });
    if (response.ok) {
      await this.getMe(this.auth_token);
    }
    return response.ok;
  };

  addCard = async (card_number, cvv, date_end) => {
    const response = await fetch(`${base_url}/cards`, {
      method: "POST",
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.auth_token}`,
      },
      body: JSON.stringify({
        number: card_number,
        cvv: cvv,
        date: date_end,
      }),
    });
    if (response.ok) {
      await this.getMe(this.auth_token);
    }
    return response.ok;
  };

  sendRestorePassword = async (values) => {
    const response = await fetch(
      `${base_url}/restore_pass?username=${values?.login}`,
      {
        method: "POST",
        headers: {
          accept: "application/json",
        },
      }
    );
    this.temp_data = values;
    return response.ok;
  };

  inputCode = async (values) => {
    const response = await fetch(
      `${base_url}/restore_pass?username=${this.temp_data?.login}&code=${values?.resetCode}&newPass=${values?.password}`,
      {
        method: "PUT",
        headers: {
          accept: "application/json",
        },
      }
    );
    if (response.ok) {
      this.temp_data = {};
    }
    return response.ok;
  };

  getCart = async (token) => {
    const response = await fetch(`${base_url}/games/cart`, {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    const result = await response.json();
    this.cart = result;
  };

  addToCart = async (id) => {
    const response = await fetch(`${base_url}/games/cart/${id}`, {
      method: "POST",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${this.auth_token}`,
      },
    });
    if (response.ok) {
      await this.getCart(this.auth_token);
    }
    return response.ok;
  };

  increaseBalance = async (values) => {
    const response = await fetch(
      `${base_url}/balance?count=${values?.balance}`,
      {
        method: "POST",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${this.auth_token}`,
        },
      }
    );
    if (response.ok) {
      await this.getMe(this.auth_token);
    }
    return response.ok;
  };

  getBought = async (token) => {
    const response = await fetch(`${base_url}/bought`, {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    const result = await response.json();
    this.boughts = result;
  };

  buy = async (price) => {
    const response = await fetch(`${base_url}/games/cart/?fullprice=${price}`, {
      method: "POST",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${this.auth_token}`,
      },
    });
    if (response.ok) {
      await this.getMe(this.auth_token);
      await this.getBought(this.auth_token);
    }
    return response;
  };

  setDiscount = async () => {
    const response = await fetch(
      `${base_url}/discount?discount=${this.boughts?.length != 0 ? 0 : 5}`,
      {
        method: "GET",
        headers: {
          accept: "application/json",
        },
      }
    );
  };
}

export default userStore;
