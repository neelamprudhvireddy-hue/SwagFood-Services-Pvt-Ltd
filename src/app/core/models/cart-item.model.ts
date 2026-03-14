export interface CartItem {
  id: string;
  menuItemId: string;
  restaurantId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  isVeg: boolean;
}

