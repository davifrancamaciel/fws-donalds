"use server";

import { ConsumptionMethod } from "@prisma/client";

import { CartProduct } from "../contexts/cart";
import api from "../../../../services/api";

interface CreateOrderInput {
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  products: Array<CartProduct>;
  consumptionMethod: ConsumptionMethod;
  slug: string;
}

export const createOrder = async (input: CreateOrderInput) => {
  const data = {
    productsSales: input.products.map((x) => ({
      productId: x.id,
      amount: x.quantity,
    })),
    companyId: input.products[0].restaurant.id,
    note: input.consumptionMethod === "DINE_IN" ? "PEGAR NO LOCAL" : "ENTREGAR",
    clientName: input.clientName,
    clientEmail: input.clientEmail,
    clientPhone: input.clientPhone,
  };

  data.note = `${data.note}\nCliente ${input.clientName}`;
  const resp = await api.post(`/sales/public`, data);

  return resp.data;
};
