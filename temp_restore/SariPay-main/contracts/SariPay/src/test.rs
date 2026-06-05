#![cfg(test)]
use super::*;
use soroban_sdk::{testutils::Address as _, token, Address, Env};

fn setup_test() -> (Env, SariPayB2BContractClient<'static>, Address, Address, token::Client<'static>, token::StellarAssetClient<'static>) {
    let env = Env::default();
    env.mock_all_auths();

    let contract_id = env.register_contract(None, SariPayB2BContract);
    let client = SariPayB2BContractClient::new(&env, &contract_id);

    let merchant = Address::generate(&env);
    let distributor = Address::generate(&env);

    let token_admin = Address::generate(&env);
    let token_contract = env.register_stellar_asset_contract(token_admin);
    let token = token::Client::new(&env, &token_contract);
    let token_admin_client = token::StellarAssetClient::new(&env, &token_contract);

    // Give merchant some stablecoins
    token_admin_client.mint(&merchant, &2000);

    (env, client, merchant, distributor, token, token_admin_client)
}

#[test]
fn test_1_happy_path() {
    let (env, client, merchant, distributor, token, _) = setup_test();
    let order_id = 101_u64;
    let amount = 500_i128;

    client.init_order(&order_id, &merchant, &distributor, &token.address, &amount);
    client.fund_order(&order_id);
    client.confirm_delivery(&order_id);

    // Verify distributor received the exact funds
    assert_eq!(token.balance(&distributor), amount);
    assert_eq!(token.balance(&env.current_contract_address()), 0);
}

#[test]
#[should_panic(expected = "Order must be funded before delivery confirmation")]
fn test_2_confirm_delivery_unfunded_failure() {
    let (_env, client, merchant, distributor, token, _) = setup_test();
    let order_id = 202_u64;

    client.init_order(&order_id, &merchant, &distributor, &token.address, &100);
    // Intentional failure: attempt to confirm delivery without calling fund_order() first
    client.confirm_delivery(&order_id);
}

#[test]
fn test_3_state_verification() {
    let (env, client, merchant, distributor, token, _) = setup_test();
    let order_id = 303_u64;

    client.init_order(&order_id, &merchant, &distributor, &token.address, &300);
    client.fund_order(&order_id);

    // Reconstruct key to directly check storage state properties
    let key = DataKey::Order(order_id);
    let stored_order: SupplyOrder = env.storage().instance().get(&key).unwrap();
    
    assert_eq!(stored_order.status, OrderStatus::Funded);
    assert_eq!(token.balance(&env.current_contract_address()), 300);
}

#[test]
#[should_panic(expected = "Order cannot be funded in current state")]
fn test_4_cannot_fund_twice() {
    let (_env, client, merchant, distributor, token, _) = setup_test();
    let order_id = 404_u64;

    client.init_order(&order_id, &merchant, &distributor, &token.address, &150);
    client.fund_order(&order_id);
    // Double funding call must panic
    client.fund_order(&order_id);
}

#[test]
fn test_5_distributor_cancel_with_refund() {
    let (env, client, merchant, distributor, token, _) = setup_test();
    let order_id = 505_u64;
    let initial_balance = token.balance(&merchant);

    client.init_order(&order_id, &merchant, &distributor, &token.address, &400);
    client.fund_order(&order_id);
    
    // Distributor invokes contract cancel option
    client.cancel_order(&order_id);

    // Verify merchant got refunded and status is updated correctly
    assert_eq!(token.balance(&merchant), initial_balance);
    let key = DataKey::Order(order_id);
    let stored_order: SupplyOrder = env.storage().instance().get(&key).unwrap();
    assert_eq!(stored_order.status, OrderStatus::Canceled);
}