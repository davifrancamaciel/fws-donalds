"use server";

import { ConsumptionMethod } from "@prisma/client";
// import { revalidatePath } from "next/cache";
// import { redirect } from "next/navigation";

// import { removeCpfPunctuation } from "../helpers/cpf";
import { CartProduct } from "../contexts/cart";
import api from "../../../../services/api";

interface CreateOrderInput {
  customerName: string;
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
  };

  data.note = `${data.note}\nCliente ${input.customerName}`;
  const resp = await api.post(`/sales/public`, data);

  console.log(resp);

  // revalidatePath(`/${input.slug}/orders`);
  // redirect(
  //   `/${input.slug}/orders?cpf=${removeCpfPunctuation(input.customerCpf)}`,
  // );
};
