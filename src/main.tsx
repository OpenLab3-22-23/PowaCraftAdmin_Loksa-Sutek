// @ts-nocheck

import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { AuthProvider } from "./auth/Auth";
import "./index.css";
import { router } from "./router/router";
import { I18nextProvider } from "react-i18next";
import i18n from "./i18n/index"; 

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <I18nextProvider i18n={i18n}>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </I18nextProvider>
  </React.StrictMode>
);