# Pull Request: Add ERPNext Adaptor

## Summary

Add new ERPNext adaptor with full CRUD operations and API Key/Secret authentication.

Fixes # (this is a new adaptor contribution)

## Details

This PR introduces a new adaptor for ERPNext (Frappe Framework), enabling OpenFn workflows to integrate with ERPNext ERP systems.

**Features implemented:**
- **CRUD Operations**: `create()`, `read()`, `update()`, `deleteRecord()` for managing ERPNext documents
- **Query Operations**: `getList()` with filters, pagination, and field selection; `getCount()` for document counting
- **Authentication**: API Key/Secret token-based authentication using frappe-js-sdk v1.11.0
- **Documentation**: Comprehensive JSDoc with examples for all functions, plus authentication guide in README
- **Testing**: 17 unit tests with full coverage, plus integration tests against live ERPNext instance
- **Assets**: Official ERPNext logos (256x256 and 512x190)

**Technical highlights:**
- Uses `frappe-js-sdk` v1.11.0 for ERPNext API interactions
- Token-based authentication: `apiKey:apiSecret` format
- Supports all ERPNext DocTypes (Customer, Sales Order, Item, etc.)
- Filters follow Frappe's array-of-arrays format: `[['field', 'operator', 'value']]`
- Proper error handling and state management using language-common patterns

**Testing approach:**
- Discovery-first methodology: queried live instance to understand real data structures
- Validated against live ERPNext instance (https://erpnext-openfn-test.jh.erpnext.com)
- All 6 operations tested end-to-end with realistic data
- Performance: operations complete in 0.6s-2.6s range

**Authentication note:**
Initially implemented both API Key/Secret and Username/Password auth, but removed username/password after discovering permission limitations on ERPNext instances. API Key/Secret is the recommended and fully-tested authentication method.

## AI Usage

Please disclose how you've used AI in this work (it's cool, we just want to know!):

- [x] Code generation (copilot but not intellisense)
- [x] Learning or fact checking
- [x] Strategy / design
- [x] Optimisation / refactoring
- [x] Translation / spellchecking / doc gen
- [ ] Other
- [ ] I have not used AI

**AI Disclosure**: This adaptor was developed with significant assistance from Claude (Anthropic). Claude helped with:
- Initial adaptor structure and code generation
- Authentication implementation and debugging
- Test design and integration testing strategy
- Documentation writing and JSDoc examples
- Logo sourcing and resizing
- Following OpenFn best practices and patterns

## Review Checklist

Before merging, the reviewer should check the following items:

- [ ] Does the PR do what it claims to do?
- [ ] If this is a new adaptor, added the adaptor on marketing website?
- [ ] If this PR includes breaking changes, do we need to update any jobs in production? Is it safe to release?
- [x] Are there any unit tests? (17 passing unit tests)
- [x] Is there a changeset associated with this PR? Should there be? (Yes - `.changeset/erpnext-initial.md`)
- [x] Have you ticked a box under AI Usage?

---

## Instructions for Creating the PR

1. Go to: https://github.com/OpenFn/adaptors/compare/main...rubailly:adaptors:main
2. Click "Create pull request"
3. Use the title: **Add ERPNext adaptor with CRUD operations**
4. Copy the content above into the PR description
5. Submit the pull request
6. Assign reviewers: @mtuchi or @josephjclark (as per OpenFn guidelines)
