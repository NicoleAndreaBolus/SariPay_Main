#![no_std]
use soroban_sdk::{contract, contractimpl, contracttype, token, Address, Env};

#[contracttype]
#[derive(Clone, Copy, Debug, PartialEq)]
pub enum OrderStatus {
    Initialized = 0,
    Funded = 1,
    Delivered = 2,
    Canceled = 3,
}

#[contracttype]
#[derive(Clone, Debug, PartialEq)]
pub struct SupplyOrder {
    pub merchant: Address,
    pub distributor: Address,
    pub token: Address,
    pub amount: i128,
    pub status: OrderStatus,
}

#[contracttype]
pub enum DataKey {
    Order(u64),
}

#[contract]
pub struct SariPayB2BContract;

#[contractimpl]
impl SariPayB2BContract {
    /// Initializes a brand new B2B supply purchase order registry entry
    pub fn init_order(env: Env, order_id: u64, merchant: Address, distributor: Address, token: Address, amount: i128) {
        distributor.require_auth();
        
        let key = DataKey::Order(order_id);
        if env.storage().instance().has(&key) {
            panic!("Order ID already exists");
        }

        let order = SupplyOrder {
            merchant,
            distributor,
            token,
            amount,
            status: OrderStatus::Initialized,
        };

        env.storage().instance().set(&key, &order);
    }

    /// Deposits and locks the stablecoin payment amount from merchant into the contract escrow escrow
    pub fn fund_order(env: Env, order_id: u64) {
        let key = DataKey::Order(order_id);
        let mut order: SupplyOrder = env.storage().instance().get(&key).expect("Order not found");
        
        order.merchant.require_auth();
        if order.status != OrderStatus::Initialized {
            panic!("Order cannot be funded in current state");
        }

        // Transfer stablecoins from the merchant account into this contract storage escrow
        let token_client = token::Client::new(&env, &order.token);
        token_client.transfer(&order.merchant, &env.current_contract_address(), &order.amount);

        order.status = OrderStatus::Funded;
        env.storage().instance().set(&key, &order);
    }

    /// Merchant verifies receipt of goods, executing the payout from escrow to the distributor account
    pub fn confirm_delivery(env: Env, order_id: u64) {
        let key = DataKey::Order(order_id);
        let mut order: SupplyOrder = env.storage().instance().get(&key).expect("Order not found");
        
        order.merchant.require_auth();
        if order.status != OrderStatus::Funded {
            panic!("Order must be funded before delivery confirmation");
        }

        // Payout the held tokens from this contract to the distributor
        let token_client = token::Client::new(&env, &order.token);
        token_client.transfer(&env.current_contract_address(), &order.distributor, &order.amount);

        order.status = OrderStatus::Delivered;
        env.storage().instance().set(&key, &order);
    }

    /// Allows the distributor to programmatically reject or cancel an unfulfilled order
    pub fn cancel_order(env: Env, order_id: u64) {
        let key = DataKey::Order(order_id);
        let mut order: SupplyOrder = env.storage().instance().get(&key).expect("Order not found");
        
        order.distributor.require_auth();
        
        if order.status == OrderStatus::Funded {
            // Refund the locked escrow directly back to the merchant if already funded
            let token_client = token::Client::new(&env, &order.token);
            token_client.transfer(&env.current_contract_address(), &order.merchant, &order.amount);
        } else if order.status != OrderStatus::Initialized {
            panic!("Order cannot be canceled in its current state");
        }

        order.status = OrderStatus::Canceled;
        env.storage().instance().set(&key, &order);
    }

    /// Read order details from contract storage
    pub fn get_order(env: Env, order_id: u64) -> Option<SupplyOrder> {
        let key = DataKey::Order(order_id);
        env.storage().instance().get(&key)
    }
}

#[cfg(test)]
mod test;