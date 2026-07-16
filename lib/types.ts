export type BrandId = "hyundai" | "kia" | "genesis" | "ssangyong";
export type CategoryId =
  | "engine"
  | "chassis"
  | "brakes"
  | "body"
  | "filters"
  | "electric"
  | "oils";

export interface Product {
  id: string;
  name: string;
  brand: BrandId;
  model: string;
  category: CategoryId;
  price: number;
  oem: string;
  stock: number;
  desc: string;
  image: string;
  popular?: boolean;
}

export interface CartItem {
  productId: string;
  qty: number;
}
