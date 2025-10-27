// Discover Item structure from live ERPNext instance

getList('Item', {
  limit: 3,
  fields: ['name', 'item_code', 'item_name', 'item_group', 'stock_uom', 'standard_rate', 'is_stock_item', 'disabled']
});
