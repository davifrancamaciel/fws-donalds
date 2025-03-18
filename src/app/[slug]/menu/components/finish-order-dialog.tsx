"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ConsumptionMethod } from "@prisma/client";
import { Loader2Icon } from "lucide-react";
import { useParams, useSearchParams } from "next/navigation";
import { useContext, useTransition } from "react";
import { useForm } from "react-hook-form";
import { PatternFormat } from "react-number-format";
import { toast } from "sonner";
import { z } from "zod";

import { removeCpfPunctuation } from "../helpers/cpf";
// import { revalidatePath } from "next/cache";
// import { redirect } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { createOrder } from "../actions/create-order";
import { CartContext } from "../contexts/cart";
// import { isValidCpf } from "../helpers/cpf";

const formSchema = z.object({
  name: z.string().trim().min(1, {
    message: "O nome é obrigatório.",
  }),
  email: z.string(),
  phone: z.string().trim().min(1, {
    message: "O Whatsapp é obrigatório.",
  }),
  // .refine((value) => isValidCpf(value), {
  //   message: "Whatsapp inválido.",
  // }),
});

type FormSchema = z.infer<typeof formSchema>;

interface FinishOrderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const FinishOrderDialog = ({ open, onOpenChange }: FinishOrderDialogProps) => {
  const { slug } = useParams<{ slug: string }>();
  const { products, clearCart,toggleCart } = useContext(CartContext);
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
    },
    shouldUnregister: true,
  });
  const onSubmit = async (data: FormSchema) => {
    try {
      const consumptionMethod = searchParams.get(
        "consumptionMethod",
      ) as ConsumptionMethod;

      const email = data.email
        ? data.email
        : `${removeCpfPunctuation(data.phone)}@emai.com`;
      startTransition(async () => {
        const resp = await createOrder({
          consumptionMethod,
          clientName: data.name,
          clientEmail: email,
          clientPhone: removeCpfPunctuation(data.phone),
          products,
          slug,
        });
        onOpenChange(false);
        // revalidatePath(`/${input.slug}/orders`);
        // redirect(
        //   `/${input.slug}/orders?cpf=${removeCpfPunctuation(input.customerCpf)}`,
        // );
        toast.success("Pedido finalizado com sucesso!");
        const sendPhone = products[0].restaurant.phone;
        const propMessage = `Olá eu meu nome é *${data.name}*%0A%0AGostaria de fazer o seguinte pedido%0A
        ${products.map((x) => `%0A${x.quantity} ${x.name}`)}%0A%0APara *${consumptionMethod === "DINE_IN" ? "RETIRAR NA LOJA" : "ENTREGA"}*`;
        clearCart();
        toggleCart();
        window.location.href = `https://api.whatsapp.com/send?phone=55${sendPhone}&text=${propMessage}%0APedido: ${resp.id}`;
      });
    } catch (error) {
      console.error(error);
      toast.error("Ocorreu um erro ao enviar seu pedido");
    }
  };
  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerTrigger asChild></DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Finalizar Pedido</DrawerTitle>
          <DrawerDescription>
            Insira suas informações abaixo para finalizar o seu pedido.
          </DrawerDescription>
        </DrawerHeader>
        <div className="p-5">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Seu nome</FormLabel>
                    <FormControl>
                      <Input placeholder="Digite seu nome..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Seu Whatsapp</FormLabel>
                    <FormControl>
                      <PatternFormat
                        placeholder="Digite seu Whatsapp..."
                        format="(##) #####-####"
                        customInput={Input}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Seu Email</FormLabel>
                    <FormControl>
                      <Input placeholder="Digite seu Email..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DrawerFooter>
                <Button
                  type="submit"
                  variant="destructive"
                  className="rounded-full"
                  disabled={isPending}
                >
                  {isPending && <Loader2Icon className="animate-spin" />}
                  Finalizar
                </Button>
                <DrawerClose asChild>
                  <Button className="w-full rounded-full" variant="outline">
                    Cancelar
                  </Button>
                </DrawerClose>
              </DrawerFooter>
            </form>
          </Form>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default FinishOrderDialog;
