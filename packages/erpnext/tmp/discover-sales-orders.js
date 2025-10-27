// Discover Sales Order structure from live ERPNext instance

getList('Sales Order', {
  limit: 3,
  fields: ['name', 'customer', 'transaction_date', 'delivery_date', 'status', 'grand_total', 'currency', 'docstatus']
});
