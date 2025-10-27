# ERPNext Doctype Structures - Discovery Results

**Instance**: https://erpnext-openfn-test.jh.erpnext.com
**Date**: January 25, 2025

This document contains the real data structures discovered from the live ERPNext instance. Use this information to build realistic test datasets.

## Customer

**Doctype Name**: `Customer`

### Sample Records

Your instance has 3+ customers with demo data:
- `Grant Plastics Ltd.`
- `Palmer Productions Ltd.`
- `West View Software Ltd.`

### Field Structure

| Field Name | Type | Example Value | Notes |
|------------|------|---------------|-------|
| `name` | String | "Grant Plastics Ltd." | Primary key (auto-generated or customer name) |
| `customer_name` | String | "Grant Plastics Ltd." | **Required** - Display name |
| `customer_type` | String | "Company" | **Required** - Options: "Company", "Individual" |
| `customer_group` | String | "Demo Customer Group" | **Required** - Valid group from system |
| `territory` | String | null | Optional - Can be null in demo data |
| `default_currency` | String | null | Optional - Defaults to system currency |
| `mobile_no` | String | null | Optional - Phone number |
| `email_id` | String | null | Optional - Email address |
| `disabled` | Integer | 0 | 0 = Active, 1 = Disabled |

### Valid Values Discovered

- **customer_type**: "Company" (seen in demo data)
- **customer_group**: "Demo Customer Group" (may have others)

---

## Item

**Doctype Name**: `Item`

### Sample Records

Your instance has 3+ items:
- `SKU001` - T-shirt
- `SKU002` - Laptop
- `SKU003` - Book

### Field Structure

| Field Name | Type | Example Value | Notes |
|------------|------|---------------|-------|
| `name` | String | "SKU001" | Primary key (item_code) |
| `item_code` | String | "SKU001" | **Required** - Unique identifier |
| `item_name` | String | "T-shirt" | **Required** - Display name |
| `item_group` | String | "Demo Item Group" | **Required** - Item category |
| `stock_uom` | String | "Nos" | **Required** - Unit of Measure |
| `standard_rate` | Number | 0 | Optional - Default price |
| `is_stock_item` | Integer | 1 | 1 = Stock item, 0 = Non-stock |
| `disabled` | Integer | 0 | 0 = Active, 1 = Disabled |

### Valid Values Discovered

- **item_group**: "Demo Item Group"
- **stock_uom**: "Nos" (Numbers/Pieces)
- **is_stock_item**: 1 (stock items)

---

## Sales Order

**Doctype Name**: `Sales Order`

### Sample Records

Your instance has 3+ sales orders:
- `SAL-ORD-2025-00001` - $20,000
- `SAL-ORD-2025-00002` - $32,000
- `SAL-ORD-2025-00003` - $229,000

### Field Structure

| Field Name | Type | Example Value | Notes |
|------------|------|---------------|-------|
| `name` | String | "SAL-ORD-2025-00001" | Primary key (auto-generated) |
| `customer` | String | "Grant Plastics Ltd." | **Required** - Reference to Customer |
| `transaction_date` | Date | "2025-05-30" | **Required** - Order date |
| `delivery_date` | Date | "2025-05-30" | Optional - Expected delivery |
| `status` | String | "Completed" | Auto-managed status |
| `grand_total` | Number | 20000 | Calculated total amount |
| `currency` | String | "USD" | **Required** - Transaction currency |
| `docstatus` | Integer | 1 | 0=Draft, 1=Submitted, 2=Cancelled |

### Valid Values Discovered

- **customer**: Must reference existing Customer (e.g., "Grant Plastics Ltd.")
- **status**: "Completed" (also: "Draft", "To Deliver and Bill", "To Bill")
- **currency**: "USD"
- **docstatus**: 1 = Submitted documents
- **ID Pattern**: `SAL-ORD-YYYY-#####`

---

## Key Learnings

### ID/Name Patterns
- **Customer**: Uses customer name as ID (e.g., "Grant Plastics Ltd.")
- **Item**: Uses item_code as ID (e.g., "SKU001")
- **Sales Order**: Auto-generated pattern `SAL-ORD-YYYY-#####`

### Required Fields Summary
When creating test data, ensure you include:

**Customer**:
- `customer_name` ✓
- `customer_type` ✓ (use "Company" or "Individual")
- `customer_group` ✓ (use "Demo Customer Group" for tests)

**Item**:
- `item_code` ✓
- `item_name` ✓
- `item_group` ✓ (use "Demo Item Group")
- `stock_uom` ✓ (use "Nos")

**Sales Order**:
- `customer` ✓ (reference existing customer)
- `transaction_date` ✓
- `currency` ✓ (use "USD")
- `items` ✓ (array of item references with qty and rate)

### Relationships
- Sales Orders reference Customers by name
- Sales Orders contain Items (in the `items` child table)

---

## Next Steps

Use these structures to:
1. Build realistic test datasets in `tmp/state.json`
2. Create test expression files that use real field names
3. Test CRUD operations with confidence

