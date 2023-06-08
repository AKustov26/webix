// @ts-ignore
import { registerWebixUIComponent } from "./sources/webix-ui.js";
import "./assets/main.css";

// primevue css
import "primevue/resources/themes/lara-light-indigo/theme.css";
import "primevue/resources/primevue.min.css";

// @ts-ignore
import { createApp } from "vue/dist/vue.esm-bundler";
import { createPinia } from "pinia";

// primevue
import PrimeVue from "primevue/config";
import OverlayPanel from "primevue/overlaypanel";

// @ts-ignore
import App from "./App.vue";
import router from "./router";

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(PrimeVue);

app.component("OverlayPanelItem", OverlayPanel);

registerWebixUIComponent(app);

app.mount("#app");
