import "./styles.css";

import { createApp } from "vue";
import { createPinia } from "pinia";
import { createHead } from "@unhead/vue";
import App from "./App.vue";

import router from "./plugins/router";

const app = createApp(App);
const head = createHead();

app.use(router);
app.use(head);
app.use(createPinia());

app.mount("#app");
