
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
  },
  {
    id: 'prod-002',
    name: 'Nike Air Force 1 Low',
    description: 'The classic Nike Air Force 1 delivers comfort and style with premium leather construction and legendary Air cushioning technology.',
    price: 90.00,
    image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=600&h=600&fit=crop&crop=center',
    variants: {
      color: ['White', 'Black', 'Blue', 'Grey'],
      size: ['7', '8', '9', '10', '11', '12']
    },
    inventory: 35
  },
  {
    id: 'prod-003',
    name: 'Adidas Stan Smith Classic',
    description: 'The timeless Adidas Stan Smith combines minimalist design with premium materials for an effortlessly stylish look.',
    price: 85.00,
    image: 'https://images.unsplash.com/photo-1607522370275-f14206abe5d3?w=600&h=600&fit=crop&crop=center',
    variants: {
      color: ['White/Green', 'White/Black', 'All White', 'Navy'],
      size: ['7', '8', '9', '10', '11', '12']
    },
    inventory: 42
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
