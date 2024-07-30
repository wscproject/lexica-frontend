import { createApp } from "vue";
import {
  createMemoryHistory,
  createRouter,
  createWebHistory,
} from "vue-router";
import VueCookies from "vue3-cookies";
import "./style.css";
import Home from "./pages/Home/index.vue";
import About from "./pages/About/index.vue";
import Guide from "./pages/Guide/index.vue";
import Session from "./pages/Session/index.vue";
import Success from "./pages/Success/index.vue";
import Privacy from "./pages/Privacy/index.vue";
import License from "./pages/License/index.vue";

import AuthLayout from "./components/layout/auth/index.vue";
import HomeLayout from "./components/layout/home/index.vue";
import SessionLayout from "./components/layout/session/index.vue";

import "vuetify/styles";
import App from "./App.vue";
import { createVuetify } from "vuetify";
import { createPinia } from "pinia";
import * as directives from "vuetify/directives";
import * as components from "vuetify/components";
import "./index.css";
import "@wikimedia/codex/dist/codex.style.css";
import { cookies } from "@/helper/cookies";

const routes = [
  {
    path: "/",
    name: "home",
    component: Home,
    meta: { layout: HomeLayout },
  },
  {
    path: "/about",
    name: "about",
    component: About,
  },
  {
    path: "/privacy-policy",
    name: "privacy-policy",
    component: Privacy,
  },
  {
    path: "/license-list",
    name: "license",
    component: License,
  },
  {
    path: "/guide",
    name: "guide",
    component: Guide,
    beforeEnter: () => {
      if (!cookies("auth")) {
        return "/";
      }
    },
  },
  {
    path: "/session",
    name: "session",
    component: Session,
    meta: { layout: SessionLayout },
    beforeEnter: (to, from) => {
      if (!cookies("auth")) {
        return "/";
      }
    },
  },
  {
    path: "/success",
    name: "success",
    component: Success,
  },
  // { path: "/about", name: "about", component: About },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.VITE_URL),
  routes,
});

const vuetify = createVuetify({
  components,
  directives,
});

const pinia = createPinia();

const app = createApp(App);
app.use(router);
app.use(vuetify);
app.use(pinia);
app.use(VueCookies);
app.mount("#app");
