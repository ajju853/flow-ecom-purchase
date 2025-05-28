
import { Order } from '../contexts/OrderContext';

class DatabaseService {
  private orders: Order[] = [];
  private products: any[] = [];

  async saveOrder(order: Order): Promise<boolean> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    try {
      console.log('Saving order to database:', order.orderNumber);
      this.orders.push(order);
      
      localStorage.setItem('ecommerce_orders', JSON.stringify(this.orders));
      
      return true;
    } catch (error) {
      console.error('Database save failed:', error);
      return false;
    }
  }

  async getOrder(orderNumber: string): Promise<Order | null> {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    try {
      const savedOrders = localStorage.getItem('ecommerce_orders');
      if (savedOrders) {
        this.orders = JSON.parse(savedOrders);
      }
      
      return this.orders.find(order => order.orderNumber === orderNumber) || null;
    } catch (error) {
      console.error('Database fetch failed:', error);
      return null;
    }
  }

  async getAllOrders(): Promise<Order[]> {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    try {
      const savedOrders = localStorage.getItem('ecommerce_orders');
      if (savedOrders) {
        this.orders = JSON.parse(savedOrders);
      }
      
      return this.orders;
    } catch (error) {
      console.error('Database fetch failed:', error);
      return [];
    }
  }

  async updateProductInventory(productId: string, quantity: number): Promise<boolean> {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    console.log(`Updating product ${productId} inventory by -${quantity}`);
    return true;
  }

  async initializeDatabase(): Promise<void> {
    console.log('Database initialized');
  }
}

export const databaseService = new DatabaseService();
