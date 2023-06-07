// @ts-ignore
import { registerWebixUIComponent } from "./sources/webix-ui.js";
import "./assets/main.css";

// @ts-ignore
import { createApp } from "vue/dist/vue.esm-bundler";
import { createPinia } from "pinia";


// @ts-ignore
import App from "./App.vue";
import router from "./router";

const app = createApp(App);

app.use(createPinia());
app.use(router);

registerWebixUIComponent(app);

app.mount("#app");
