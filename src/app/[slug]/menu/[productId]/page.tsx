import { notFound } from "next/navigation";

import api from "../../../../services/api";

import ProductDetails from "./components/product-details";
import ProductHeader from "./components/product-header";

interface ProductPageProps {
  params: Promise<{ slug: string; productId: number }>;
}

const ProductPage = async ({ params }: ProductPageProps) => {
  const { slug, productId } = await params;

  const responseRestaurant = await api.get(`/companies/public/${slug}`);
  const restaurant = responseRestaurant.data;

  const responseProducts = await api.get(
    `/products/public/${restaurant.id}/${productId}`,
  );
  const product: Product = responseProducts.data;
  product.restaurant = restaurant;

  if (!product) {
    return notFound();
  }
  if (restaurant.name.replace(" ", "").toUpperCase() !== slug.toUpperCase()) {
    return notFound();
  }
  return (
    <div className="flex h-full flex-col">
      <ProductHeader product={product} />
      <ProductDetails product={product} />
    </div>
  );
};

export default ProductPage;
