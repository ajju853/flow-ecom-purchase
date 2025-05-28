
import { Product } from '../contexts/CartContext';

const mockProducts: Product[] = [
  {
    id: 'prod-001',
    name: 'Converse Chuck Taylor All Star II Hi',
    description: 'The iconic Chuck Taylor All Star gets a modern upgrade with premium materials and enhanced comfort. Featuring a padded tongue and collar, plus improved cushioning for all-day wear.',
    price: 75.00,
    image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600&h=600&fit=crop&crop=center',
    variants: {
      color: ['Black', 'White', 'Red', 'Navy'],
      size: ['7', '8', '9', '10', '11', '12']
    },
    inventory: 50
  }
];

export const getProduct = async (id: string): Promise<Product | null> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return mockProducts.find(product => product.id === id) || mockProducts[0];
};

export const getAllProducts = async (): Promise<Product[]> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  return mockProducts;
};

export const updateInventory = async (productId: string, quantity: number): Promise<boolean> => {
  await new Promise(resolve => setTimeout(resolve, 200));
  const product = mockProducts.find(p => p.id === productId);
  if (product && product.inventory >= quantity) {
    product.inventory -= quantity;
    return true;
  }
  return false;
};
