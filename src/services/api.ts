import { Response } from "../helpers/commonInterfaces";

const api = {
  get: (url: string): Promise<Response> => {
    return request("GET", url, null);
  },
  post: (url: string, data: any): Promise<Response> => {
    return request("POST", url, data);
  },
  put: (url: string, data: any): Promise<Response> => {
    return request("PUT", url, data);
  },
  delete: (url: string): Promise<Response> => {
    return request("DELETE", url);
  },
  patch: (url: string, data: any): Promise<Response> => {
    return request("PATCH", url, data);
  },
};

const request = async (
  method: "POST" | "GET" | "PUT" | "DELETE" | "PATCH",
  url: string,
  data: any = null,
): Promise<Response> => {
  /**
   * Definição da chamada das requests axios
   */

  try {
    let config = {};
    if (method === "POST" || method === "PUT") {
      config = {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      };
    } else {
      config = {
        method: method,
        headers: { "Content-Type": "application/json" },
      };
    }

    const res = await fetch(
      `${process.env.REACT_APP_BASE_URL_API}/${url}`,
      config,
    );

    const datares = await res.json();
    console.log(datares);

    return datares;
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
