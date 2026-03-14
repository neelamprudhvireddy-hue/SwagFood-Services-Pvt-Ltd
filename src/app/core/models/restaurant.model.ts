export interface Restaurant {
  id: string;
  name: string;
  description: string;
  image: string;
  cuisines: string[];
  rating: number;
  deliveryTime: string;
  costForTwo: number;
  isFavorite: boolean;
  distanceKm: number;
  address: string;
  tags: string[];
  promoted?: boolean;
  avgOrderValue: number;
  reviewCount: number;
}

