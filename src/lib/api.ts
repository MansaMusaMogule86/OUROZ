import type { Category, Brand, Product } from '@/types/shop';

export async function fetchCategories(): Promise<Category[]> {
  return [
    { id: '1', slug: 'spices', name: 'Spices', image_url: '/images/categories/spices.jpg' },
    { id: '2', slug: 'oils', name: 'Oils', image_url: '/images/categories/oils.jpg' },
    { id: '3', slug: 'tea', name: 'Tea', image_url: '/images/categories/tea.jpg' },
    { id: '4', slug: 'olives', name: 'Olives', image_url: '/images/categories/olives.jpg' },
    { id: '5', slug: 'ceramics', name: 'Ceramics', image_url: '/images/categories/ceramics.jpg' },
    { id: '6', slug: 'pantry-goods', name: 'Pantry Goods', image_url: '/images/categories/pantry.jpg' },
  ];
}

export async function fetchBrands(): Promise<Brand[]> {
  return [];
}

export async function fetchProducts(): Promise<Product[]> {
  return [
    { id: '1', name: 'Moroccan Tagine', slug: 'moroccan-tagine', price: 159, compare_at_price: 280, currency: 'AED', image_url: '/images/products/tagine.jpg', origin: 'Morocco', in_stock: true },
    { id: '2', name: 'Moroccan Argan Oil', slug: 'moroccan-argan-oil', price: 149, compare_at_price: 280, currency: 'AED', image_url: '/images/products/argan-oil.jpg', origin: 'Morocco', in_stock: true },
    { id: '3', name: 'Premium Saffron', slug: 'premium-saffron', price: 199, compare_at_price: 280, currency: 'AED', image_url: '/images/products/saffron.jpg', origin: 'Morocco', in_stock: true },
    { id: '4', name: 'Hand Argan Oil', slug: 'hand-argan-oil', price: 299, compare_at_price: 280, currency: 'AED', image_url: '/images/products/hand-argan.jpg', origin: 'Morocco', in_stock: true },
    { id: '5', name: 'Handcrafted Saffron', slug: 'handcrafted-saffron', price: 225, compare_at_price: 280, currency: 'AED', image_url: '/images/products/saffron-craft.jpg', origin: 'Morocco', in_stock: true },
    { id: '6', name: 'Moroccan Spice Mix', slug: 'moroccan-spice-mix', price: 149, compare_at_price: 280, currency: 'AED', image_url: '/images/products/spice-mix.jpg', origin: 'Morocco', in_stock: true },
  ];
}
