import { Product, Category } from "@/types";

export const products: Product[] = [
  {
    id: "1",
    name: "Wireless Bluetooth Headphones",
    description:
      "Premium noise-cancelling headphones with exceptional sound quality and comfort for extended use.",
    price: 199.99,
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1000",
    category: "electronics",
    inStock: true,
    featured: true,
    rating: 4.5,
  },
  {
    id: "2",
    name: "Smart Fitness Watch",
    description:
      "Track your fitness goals with this sleek, feature-packed smartwatch with heart rate monitoring.",
    price: 149.99,
    image:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=989",
    category: "electronics",
    inStock: true,
    featured: true,
    rating: 4.2,
  },
  {
    id: "3",
    name: "Organic Cotton T-Shirt",
    description:
      "Comfortable, eco-friendly t-shirt made from 100% organic cotton, perfect for everyday wear.",
    price: 29.99,
    image:
      "https://images.unsplash.com/photo-1581655353564-df123a1eb820?q=80&w=987",
    category: "clothing",
    inStock: true,
    featured: false,
    rating: 4.0,
  },
  {
    id: "4",
    name: "Stainless Steel Water Bottle",
    description:
      "Durable, leak-proof water bottle that keeps drinks cold for 24 hours or hot for 12 hours.",
    price: 24.99,
    image:
      "https://images.unsplash.com/photo-1589365278144-c9e705f843ba?q=80&w=987",
    category: "home",
    inStock: true,
    featured: false,
    rating: 4.8,
  },
  {
    id: "5",
    name: "Leather Wallet",
    description:
      "Classic leather wallet with multiple card slots and RFID protection technology.",
    price: 49.99,
    image:
      "https://images.unsplash.com/photo-1627123424574-724758594e93?q=80&w=987",
    category: "accessories",
    inStock: true,
    featured: true,
    rating: 4.3,
  },
  {
    id: "6",
    name: "Wireless Charging Pad",
    description:
      "Fast wireless charging for all Qi-enabled devices, with sleek minimalist design.",
    price: 39.99,
    image:
      "https://images.unsplash.com/photo-1586495777744-4413f21062fa?q=80&w=1005",
    category: "electronics",
    inStock: true,
    featured: false,
    rating: 4.1,
  },
  {
    id: "7",
    name: "Ceramic Coffee Mug Set",
    description:
      "Set of 4 hand-crafted ceramic mugs, perfect for your morning coffee or afternoon tea.",
    price: 34.99,
    image:
      "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?q=80&w=1010",
    category: "home",
    inStock: true,
    featured: false,
    rating: 4.7,
  },
  {
    id: "8",
    name: "Backpack",
    description:
      "Durable backpack with laptop compartment and multiple pockets for organization.",
    price: 79.99,
    image:
      "https://images.unsplash.com/photo-1491637639811-60e2756cc1c7?q=80&w=969",
    category: "accessories",
    inStock: true,
    featured: true,
    rating: 4.6,
  },
];

export const categories: Category[] = [
  {
    id: "electronics",
    name: "Electronics",
    image:
      "https://images.unsplash.com/photo-1550009158-9ebf69173e03?q=80&w=1001",
  },
  {
    id: "clothing",
    name: "Clothing",
    image:
      "https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?q=80&w=980",
  },
  {
    id: "home",
    name: "Home & Kitchen",
    image:
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?q=80&w=1074",
  },
  {
    id: "accessories",
    name: "Accessories",
    image:
      "https://images.unsplash.com/photo-1511499767150-a48a237f0083?q=80&w=880",
  },
];

export const getFeaturedProducts = () => {
  return products.filter((product) => product.featured);
};

export const getProductsByCategory = (categoryId: string) => {
  return products.filter((product) => product.category === categoryId);
};

export const getProductById = (id: string) => {
  return products.find((product) => product.id === id);
};
