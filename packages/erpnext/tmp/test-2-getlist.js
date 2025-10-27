// Test 2: List existing customers with filters
// This test retrieves existing demo data from your instance

getList('Customer', {
  filters: state.data.customerFilters,
  fields: ['name', 'customer_name', 'customer_type', 'customer_group', 'mobile_no', 'email_id'],
  limit: 10
});
