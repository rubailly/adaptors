// Test 5: Update a customer record
// This test updates the customer created in test-3
// IMPORTANT: Run test-3 first to create the customer!
// The customer ID should be "OpenFn Test Customer Ltd." (from state.data.updateCustomerId)

update('Customer', state.data.updateCustomerId, state.data.updateCustomerData);
