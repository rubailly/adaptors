# OpenFn PDF Adaptor

An OpenFn adaptor for generating PDF documents from JSON data and HTML templates.

## Features

- Generate PDF documents from HTML templates and JSON data
- Template rendering using Handlebars
- Support for both inline templates and template files
- Comprehensive PDF formatting options
- Binary buffer and base64 output formats
- Full CSS and HTML support via Puppeteer

## Installation

```bash
npm install @openfn/language-pdf
```

## Configuration

The adaptor can be configured with the following options:

```json
{
  "template": "<html><body><h1>{{title}}</h1></body></html>",
  "templatePath": "./templates/report.html",
  "pdfOptions": {
    "format": "A4",
    "margin": {
      "top": "0.4in",
      "right": "0.4in", 
      "bottom": "0.4in",
      "left": "0.4in"
    },
    "printBackground": false,
    "landscape": false
  }
}
```

## Usage

### Basic PDF Generation

```javascript
generatePdf({
  template: '<html><body><h1>{{title}}</h1><p>{{content}}</p></body></html>',
  data: {
    title: 'My Report',
    content: 'This is the report content'
  }
});
```

### Using Template Files

```javascript
generatePdf({
  templatePath: './templates/invoice.html',
  pdfOptions: {
    format: 'Letter',
    margin: { top: '1in', bottom: '1in' }
  }
});
```

### Advanced Template with Handlebars Features

```javascript
generatePdf({
  template: `
    <html>
      <head>
        <style>
          .header { background-color: #f0f0f0; padding: 20px; }
          .item { border-bottom: 1px solid #ccc; padding: 10px; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>{{company.name}}</h1>
          <p>Invoice #{{invoice.number}}</p>
        </div>
        
        <h2>Items</h2>
        {{#each items}}
        <div class="item">
          <strong>{{name}}</strong> - ${{price}}
          {{#if description}}
            <p>{{description}}</p>
          {{/if}}
        </div>
        {{/each}}
        
        <div class="total">
          <h3>Total: ${{total}}</h3>
        </div>
      </body>
    </html>
  `,
  data: {
    company: { name: 'Acme Corp' },
    invoice: { number: 'INV-001' },
    items: [
      { name: 'Widget A', price: 25.00, description: 'Premium widget' },
      { name: 'Widget B', price: 15.00 }
    ],
    total: 40.00
  },
  pdfOptions: {
    format: 'A4',
    printBackground: true,
    displayHeaderFooter: true,
    headerTemplate: '<div style="font-size: 10px; text-align: center;">Invoice</div>',
    footerTemplate: '<div style="font-size: 10px; text-align: center;">Page <span class="pageNumber"></span></div>'
  }
});
```

### Landscape Format

```javascript
generatePdf({
  templatePath: './templates/wide-report.html',
  pdfOptions: {
    format: 'A4',
    landscape: true,
    margin: { top: '0.5in', bottom: '0.5in' }
  }
});
```

## PDF Options

The `pdfOptions` object supports the following properties:

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `format` | string | 'A4' | Page format: A4, A3, A2, A1, A0, Letter, Legal, Tabloid, Ledger |
| `width` | string | - | Page width (overrides format) |
| `height` | string | - | Page height (overrides format) |
| `margin` | object | `{top: '0.4in', right: '0.4in', bottom: '0.4in', left: '0.4in'}` | Page margins |
| `printBackground` | boolean | false | Print background graphics |
| `landscape` | boolean | false | Use landscape orientation |
| `displayHeaderFooter` | boolean | false | Display header and footer |
| `headerTemplate` | string | - | HTML template for header |
| `footerTemplate` | string | - | HTML template for footer |

## State Object

After successful PDF generation, the state object will contain:

- `state.pdfBuffer` - PDF as binary Buffer
- `state.pdfBase64` - PDF as base64 encoded string
- `state.response` - Generation metadata including success status, timestamp, and PDF size

## Template Processing

Templates are processed using Handlebars, supporting:

- Variable substitution: `{{variable}}`
- Conditional blocks: `{{#if condition}}...{{/if}}`
- Loops: `{{#each items}}...{{/each}}`
- Helpers and nested objects: `{{user.profile.name}}`

## Error Handling

The adaptor will throw descriptive errors for:

- Missing templates or template files
- Invalid template syntax
- PDF generation failures
- Invalid PDF options

## Development

Clone the [adaptors monorepo](https://github.com/OpenFn/adaptors). Follow the `Getting Started` guide inside to get set up.

Run tests using `pnpm run test` or `pnpm run test:watch`

Build the project using `pnpm build`.

To just build the docs run `pnpm build docs`

## Dependencies

- **Puppeteer**: For PDF generation from HTML
- **Handlebars**: For template processing
- **@openfn/language-common**: For OpenFn utilities

## License

LGPLv3