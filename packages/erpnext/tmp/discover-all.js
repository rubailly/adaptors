// Discovery script to understand ERPNext data structures
// This queries your live instance to see real field names, values, and relationships

console.log('=== DISCOVERING ERPNEXT DATA STRUCTURES ===\n');

// Discover Customer structure
getList('Customer', {
  limit: 3,
  fields: ['name', 'customer_name', 'customer_type', 'customer_group', 'territory', 'default_currency', 'mobile_no', 'email_id']
});

// Count total customers
getCount('Customer');

// Discover Sales Order structure
getList('Sales Order', {
  limit: 2,
  fields: ['name', 'customer', 'transaction_date', 'delivery_date', 'status', 'grand_total', 'currency']
});

// Discover Item structure
getList('Item', {
  limit: 2,
  fields: ['name', 'item_code', 'item_name', 'item_group', 'stock_uom', 'standard_rate', 'is_stock_item']
});

// Discover Supplier structure (if available)
getList('Supplier', {
  limit: 2,
  fields: ['name', 'supplier_name', 'supplier_type', 'supplier_group', 'country']
});

console.log('\n=== Check tmp/discovered-structures.json for the complete output ===');
