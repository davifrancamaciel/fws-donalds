interface Restaurant {
  name: string;
  id: string;
  image: string;
  phone: string;
  pixKey: string;
  open: boolean;
  banner: string;
  description: string;
}

interface Product {
  name: string;
  id: number;
  price: number;
  image: string;
  companyId: string;
  open: boolean;
  banner: string;
  description: string;
  restaurant: Restaurant;
}

interface RestaurantCategories extends Restaurant {
  menuCategories: Array<CategoriesProps>;
}

interface RestaurantCategoriesProps {
  restaurant: RestaurantCategories;
}

interface CategoriesProps {
  name: string;
  id: number;
  products: Array<any>;
}
