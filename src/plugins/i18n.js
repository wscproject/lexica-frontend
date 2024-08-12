import { createI18n } from "vue-i18n";
import { useCookies } from "vue3-cookies";

import headerEn from "@/locale/en/header.json";
import headerId from "@/locale/id/header.json";

import footerEn from "@/locale/en/footer.json";
import footerId from "@/locale/id/footer.json";

import localeDialogEn from "@/locale/en/localeDialog.json";
import localeDialogId from "@/locale/id/localeDialog.json";

import homeEn from "@/locale/en/home.json";
import homeId from "@/locale/id/home.json";

import tutorialEn from "@/locale/en/tutorial.json";
import tutorialId from "@/locale/id/tutorial.json";

import tooltipsEn from "@/locale/en/tooltips.json";
import tooltipsId from "@/locale/id/tooltips.json";

import sessionEn from "@/locale/en/session.json";
import sessionId from "@/locale/id/session.json";

import aboutEn from "@/locale/en/about.json";
import aboutId from "@/locale/id/about.json";

import privacyEn from "@/locale/en/privacy.json";
import privacyId from "@/locale/id/privacy.json";

import licenseEn from "@/locale/en/license.json";
import licenseId from "@/locale/id/license.json";

const { cookies } = useCookies();

export const i18n = createI18n({
  legacy: false,
  locale: cookies?.get("locale") || "en",
  messages: {
    en: {
      header: headerEn,
      footer: footerEn,
      localeDialog: localeDialogEn,
      home: homeEn,
      tutorial: tutorialEn,
      tooltips: tooltipsEn,
      session: sessionEn,
      about: aboutEn,
      privacy: privacyEn,
      license: licenseEn,
    },
    id: {
      header: headerId,
      footer: footerId,
      localeDialog: localeDialogId,
      home: homeId,
      tutorial: tutorialId,
      tooltips: tooltipsId,
      session: sessionId,
      about: aboutId,
      privacy: privacyId,
      license: licenseId,
    },
  },
});
