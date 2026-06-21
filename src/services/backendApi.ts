/**
 * Backend service mock/facade for communicating with Django / python backend APIs
 */

export interface BackendOrder {
  id: string;
  merchantAddress: string;
  supplierName: string;
  amount: string;
  status: string;
  deliveryCode: string;
}

export const backendApi = {
  /**
   * Register a new order on the backend database
   */
  async registerOrder(order: BackendOrder): Promise<boolean> {
    // Simulating Django REST API call
    console.log("[BackendAPI] Registering order with backend:", order);
    await new Promise(resolve => setTimeout(resolve, 800));
    return true;
  },

  /**
   * Sync contract state updates to the Django backend
   */
  async syncOrderStatus(orderId: string, newStatus: string): Promise<boolean> {
    console.log(`[BackendAPI] Syncing order #${orderId} status as '${newStatus}'`);
    await new Promise(resolve => setTimeout(resolve, 500));
    return true;
  }
};
