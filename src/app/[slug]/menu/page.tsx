import { notFound } from "next/navigation";

import RestaurantCategories from "./components/categories";
import RestaurantHeader from "./components/header";

import api from "../../../services/api";

interface RestaurantMenuPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ consumptionMethod: string }>;
}

const isConsumptionMethodValid = (consumptionMethod: string) => {
  return ["DINE_IN", "TAKEAWAY"].includes(consumptionMethod.toUpperCase());
};

const RestaurantMenuPage = async ({
  params,
  searchParams,
}: RestaurantMenuPageProps) => {
  const { slug } = await params;
  const { consumptionMethod } = await searchParams;
  if (!isConsumptionMethodValid(consumptionMethod)) {
    return notFound();
  }
  
  const responseRestaurant = await api.get(`/companies/public/${slug}`);
  const restaurant = responseRestaurant.data;
  
  const responseProducts = await api.get(`/products/public/${restaurant.id}`);
  restaurant.menuCategories = responseProducts.data;
  
  if (!restaurant) {
    return notFound();
  }
  return (
    <div>
      <RestaurantHeader restaurant={restaurant} />
      <RestaurantCategories restaurant={restaurant} />
    </div>
  );
};

export default RestaurantMenuPage;