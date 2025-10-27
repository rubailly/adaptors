// Discover Customer structure from live ERPNext instance

getList('Customer', {
  limit: 5,
  fields: ['name', 'customer_name', 'customer_type', 'customer_group', 'territory', 'default_currency', 'mobile_no', 'email_id', 'disabled']
});
