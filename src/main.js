import { createApp } from "vue";
import { createRouter, createWebHistory } from "vue-router";
import VueCookies from "vue3-cookies";
import "./style.css";
import Home from "./pages/Home/index.vue";
import About from "./pages/About/index.vue";
import Guide from "./pages/Guide/index.vue";
import SessionConnect from "./pages/SessionConnect/index.vue";
import SessionScript from "./pages/SessionScript/index.vue";
import SessionHyphenation from "./pages/SessionHyphenation/index.vue";

import Success from "./pages/Success/index.vue";
import Privacy from "./pages/Privacy/index.vue";
import License from "./pages/License/index.vue";

import HomeLayout from "./components/layout/home/index.vue";
import SessionLayout from "./components/layout/session/index.vue";

import "vuetify/styles";
import App from "./App.vue";
import { createVuetify } from "vuetify";
import * as directives from "vuetify/directives";
import * as components from "vuetify/components";
import "./index.css";

import store from "./store";
import { cookies } from "@/helper/cookies";
import { i18n } from "./plugins/i18n";
import { CdxTooltip } from "@wikimedia/codex";

import "@wikimedia/codex/dist/codex.style-bidi.css";
import "@wikimedia/codex-design-tokens/theme-wikimedia-ui.css";

if (localStorage?.getItem("theme")) {
  if (localStorage?.getItem("theme") !== "auto") {
    if (localStorage.getItem("theme") === "dark") {
      document.documentElement.className = "dark";
    } else if (localStorage.getItem("theme") === "light") {
      document.documentElement.className = "light";
    }
  } else {
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      document.documentElement.className = "dark";
    } else {
      document.documentElement.className = "";
    }
  }
} else {
  if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
    document.documentElement.className = "dark";
  } else {
    document.documentElement.className = "";
  }
}

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
    path: "/session-connect",
    name: "session-connect",
    component: SessionConnect,
    meta: { layout: SessionLayout },
    beforeEnter: (to, from) => {
      if (!cookies("auth")) {
        return "/";
      }
    },
  },
  {
    path: "/session-script",
    name: "session-script",
    component: SessionScript,
    meta: { layout: SessionLayout },
    beforeEnter: (to, from) => {
      if (!cookies("auth")) {
        return "/";
      }
    },
  },
  {
    path: "/session-hyphenation",
    name: "session-hyphenation",
    component: SessionHyphenation,
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
  history: createWebHistory(),
  routes,
});

const vuetify = createVuetify({
  components,
  directives,
});

const app = createApp(App);
app.use(router);
app.use(i18n);
app.use(vuetify);
app.use(store);
app.use(VueCookies);
app.directive("tooltip", CdxTooltip);
app.mount("#app");
