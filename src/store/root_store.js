import pageStore from "./page_store.js";
import userStore from "./user_store.js";

export default class RootStore {
  userStore = new userStore();
  pageStore = new pageStore();
}
