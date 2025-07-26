import { expect } from 'chai';
import { generatePdf } from '../src/Adaptor';
import * as util from '../src/Utils';

// Mock puppeteer for testing
const mockPuppeteer = {
  launch: async () => ({
    newPage: async () => ({
      setContent: async () => {},
      pdf: async () => Buffer.from('mock-pdf-content'),
    }),
    close: async () => {},
  }),
};

describe('generatePdf', () => {
  let mockState;

  beforeEach(() => {
    mockState = {
      data: { title: 'Test Report', content: 'This is test content' },
      configuration: {
        template: '<html><body><h1>{{title}}</h1><p>{{content}}</p></body></html>',
        pdfOptions: { format: 'A4' },
      },
      references: [],
    };
  });

  describe('Basic functionality', () => {
    it('should generate PDF with template from configuration', async () => {
      const operation = generatePdf();
      const result = await operation(mockState);

      expect(result).to.have.property('pdfBuffer');
      expect(result).to.have.property('pdfBase64');
      expect(result.pdfBuffer).to.be.instanceOf(Buffer);
      expect(result.pdfBase64).to.be.a('string');
      expect(result.response).to.have.property('success', true);
      expect(result.response).to.have.property('pdfSize');
    });

    it('should use data from state.data', async () => {
      const operation = generatePdf();
      const result = await operation(mockState);

      expect(result.data).to.deep.equal(mockState.data);
    });

    it('should override template with options.template', async () => {
      const customTemplate = '<html><body><h2>{{title}}</h2></body></html>';
      const operation = generatePdf({ template: customTemplate });
      const result = await operation(mockState);

      expect(result.pdfBuffer).to.be.instanceOf(Buffer);
    });

    it('should override data with options.data', async () => {
      const customData = { title: 'Custom Title', content: 'Custom Content' };
      const operation = generatePdf({ data: customData });
      const result = await operation(mockState);

      expect(result.data).to.deep.equal(customData);
    });
  });

  describe('PDF options', () => {
    it('should merge PDF options correctly', async () => {
      const customOptions = {
        pdfOptions: {
          format: 'Letter',
          landscape: true,
          margin: { top: '1in' },
        },
      };

      const operation = generatePdf(customOptions);
      const result = await operation(mockState);

      expect(result.response.pdfOptions).to.include({
        format: 'Letter',
        landscape: true,
      });
      expect(result.response.pdfOptions.margin).to.include({ top: '1in' });
    });

    it('should use default PDF options when none provided', async () => {
      const stateWithoutOptions = { ...mockState, configuration: { template: mockState.configuration.template } };
      const operation = generatePdf();
      const result = await operation(stateWithoutOptions);

      expect(result.response.pdfOptions).to.have.property('format');
    });
  });

  describe('Error handling', () => {
    it('should throw error when no template is provided', async () => {
      const stateWithoutTemplate = {
        data: mockState.data,
        configuration: {},
        references: [],
      };

      const operation = generatePdf();
      
      try {
        await operation(stateWithoutTemplate);
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect(error.message).to.include('No template provided');
      }
    });

    it('should handle PDF generation errors gracefully', async () => {
      // Mock util.generatePdfFromHtml to throw an error
      const originalFn = util.generatePdfFromHtml;
      util.generatePdfFromHtml = async () => {
        throw new Error('PDF generation failed');
      };

      const operation = generatePdf();
      
      try {
        await operation(mockState);
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect(error.message).to.include('PDF generation failed');
      } finally {
        // Restore original function
        util.generatePdfFromHtml = originalFn;
      }
    });
  });

  describe('State management', () => {
    it('should preserve original state properties', async () => {
      const stateWithExtra = {
        ...mockState,
        customProperty: 'should be preserved',
      };

      const operation = generatePdf();
      const result = await operation(stateWithExtra);

      expect(result.customProperty).to.equal('should be preserved');
    });

    it('should add response to references array', async () => {
      const operation = generatePdf();
      const result = await operation(mockState);

      expect(result.references).to.be.an('array');
      expect(result.references[0]).to.have.property('success', true);
      expect(result.references[0]).to.have.property('timestamp');
    });

    it('should preserve existing references', async () => {
      const stateWithReferences = {
        ...mockState,
        references: [{ existing: 'reference' }],
      };

      const operation = generatePdf();
      const result = await operation(stateWithReferences);

      expect(result.references).to.have.length(2);
      expect(result.references[1]).to.deep.equal({ existing: 'reference' });
    });
  });

  describe('Template processing', () => {
    it('should process Handlebars templates correctly', async () => {
      const templateWithLogic = `
        <html>
          <body>
            <h1>{{title}}</h1>
            {{#if content}}
              <p>{{content}}</p>
            {{/if}}
            {{#each items}}
              <li>{{this}}</li>
            {{/each}}
          </body>
        </html>
      `;

      const dataWithArray = {
        title: 'My List',
        content: 'Here are the items:',
        items: ['Item 1', 'Item 2', 'Item 3'],
      };

      const stateWithComplexData = {
        ...mockState,
        data: dataWithArray,
        configuration: {
          ...mockState.configuration,
          template: templateWithLogic,
        },
      };

      const operation = generatePdf();
      const result = await operation(stateWithComplexData);

      expect(result.pdfBuffer).to.be.instanceOf(Buffer);
      expect(result.data).to.deep.equal(dataWithArray);
    });
  });
});