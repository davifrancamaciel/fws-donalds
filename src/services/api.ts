import axios from "../../node_modules/axios/index";
import { NextResponse } from "next/server";
import { Response } from "helpers/commonInterfaces";
// import {
//   localStorageGetItem,
//   localStorageRemoveItem
// } from '../utils/localStorage';
// import { KEY_STORAGE } from './defaultValues';

const api = {
  get: (url: string, showNotification: boolean = true): Promise<Response> => {
    return request("GET", url, null, showNotification);
  },
  post: (
    url: string,
    data: any,
    showNotification: boolean = true,
  ): Promise<Response> => {
    return request("POST", url, data, showNotification);
  },
  put: (
    url: string,
    data: any,
    showNotification: boolean = true,
  ): Promise<Response> => {
    return request("PUT", url, data, showNotification);
  },
  delete: (
    url: string,
    showNotification: boolean = true,
  ): Promise<Response> => {
    return request("DELETE", url, showNotification);
  },
  patch: (
    url: string,
    data: any,
    showNotification: boolean = true,
  ): Promise<Response> => {
    return request("PATCH", url, data, showNotification);
  },
};

const request = async (
  method: "POST" | "GET" | "PUT" | "DELETE" | "PATCH",
  url: string,
  data: any = null,
  showNotification: boolean = true,
): Promise<Response> => {
  /**
   * Definição da chamada das requests axios
   */
  const token = ""; //localStorageGetItem(KEY_STORAGE);
  const Authorization = token ? `Bearer ${token}` : "";

  const apiAxios = axios.create({
    baseURL: process.env.REACT_APP_BASE_URL_API || "",
    headers: {
      "Content-type": "application/json",
      // Authorization,
    },
  });
  try {
    let config = {
      method: method,
      headers: {
        "Content-Type": "application/json",
      },
      //body: {},
    };
    // if (method === "POST") config["body"] = JSON.stringify(data);
    
    const res = await fetch(
      `${process.env.REACT_APP_BASE_URL_API}/${url}`,
      config,
    );

    const datares = await res.json();
    console.log(datares);

    return datares;

    const response = await apiAxios({ method, url, data });

    // if (showNotification) {
    //   if (response.data.success)
    //     notification.success({
    //       message: response.data.message,
    //       placement: 'topRight'
    //     });
    //   else
    //     notification.error({
    //       message: response.data.message,
    //       placement: 'topRight'
    //     });
    // }

    return response.data;
  } catch (e: any) {
    if (e && e.response && e.response.status === 401) {
      //localStorageRemoveItem(KEY_STORAGE);
      const btnLogout = document.getElementById("logout");
      if (btnLogout) {
        btnLogout.click();
      }
      // notification.error({
      //   message: 'Ops! Sua autenticação expirou',
      //   description: 'Faça login novamente',
      //   placement: 'topRight'
      // });
    } else {
      // notification.error({
      //   message: 'Algo inesperado aconteceu',
      //   description:
      //     e.response && e.response.data ? e.response.data.message : e.message,
      //   placement: 'topRight'
      // });
    }
    console.log(e);
    return { success: false, message: e.message, data: null };
  }
};

export default api;
