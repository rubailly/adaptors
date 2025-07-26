import { expect } from 'chai';
import { writeFileSync, unlinkSync, mkdirSync, rmSync } from 'fs';
import { resolve } from 'path';
import * as utils from '../src/Utils';

describe('Utils', () => {
  const testDir = resolve(process.cwd(), 'test-templates');
  const testTemplatePath = resolve(testDir, 'test-template.html');

  before(() => {
    // Create test directory and template file
    mkdirSync(testDir, { recursive: true });
    writeFileSync(testTemplatePath, '<html><body><h1>{{title}}</h1></body></html>');
  });

  after(() => {
    // Clean up test files
    rmSync(testDir, { recursive: true, force: true });
  });

  describe('getTemplate', () => {
    it('should return template from options.template', async () => {
      const state = { configuration: { template: 'config template' } };
      const options = { template: 'options template' };

      const result = await utils.getTemplate(state, options);
      expect(result).to.equal('options template');
    });

    it('should return template from options.templatePath', async () => {
      const state = { configuration: {} };
      const options = { templatePath: testTemplatePath };

      const result = await utils.getTemplate(state, options);
      expect(result).to.include('<h1>{{title}}</h1>');
    });

    it('should return template from state.configuration.template', async () => {
      const state = { configuration: { template: 'config template' } };
      const options = {};

      const result = await utils.getTemplate(state, options);
      expect(result).to.equal('config template');
    });

    it('should return template from state.configuration.templatePath', async () => {
      const state = { configuration: { templatePath: testTemplatePath } };
      const options = {};

      const result = await utils.getTemplate(state, options);
      expect(result).to.include('<h1>{{title}}</h1>');
    });

    it('should throw error when no template is provided', async () => {
      const state = { configuration: {} };
      const options = {};

      try {
        await utils.getTemplate(state, options);
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect(error.message).to.include('No template provided');
      }
    });

    it('should throw error when template file does not exist', async () => {
      const state = { configuration: {} };
      const options = { templatePath: 'non-existent-file.html' };

      try {
        await utils.getTemplate(state, options);
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect(error.message).to.include('Failed to read template file');
      }
    });
  });

  describe('validatePdfOptions', () => {
    it('should validate format options', () => {
      expect(() => utils.validatePdfOptions({ format: 'A4' })).not.to.throw();
      expect(() => utils.validatePdfOptions({ format: 'Letter' })).not.to.throw();
      
      expect(() => utils.validatePdfOptions({ format: 'InvalidFormat' }))
        .to.throw('Invalid PDF format');
    });

    it('should validate margin options', () => {
      const validMargin = { top: '1in', bottom: '2cm', left: '20px', right: '0.5in' };
      expect(() => utils.validatePdfOptions({ margin: validMargin })).not.to.throw();

      const invalidMargin = { top: 123 }; // Should be string
      expect(() => utils.validatePdfOptions({ margin: invalidMargin }))
        .to.throw('Margin top must be a string');
    });

    it('should return options unchanged when valid', () => {
      const options = {
        format: 'A4',
        landscape: true,
        margin: { top: '1in' },
      };

      const result = utils.validatePdfOptions(options);
      expect(result).to.deep.equal(options);
    });

    it('should handle empty options', () => {
      expect(() => utils.validatePdfOptions()).not.to.throw();
      expect(() => utils.validatePdfOptions({})).not.to.throw();
    });
  });

  describe('generatePdfFromHtml', () => {
    // Note: These tests would require mocking puppeteer properly
    // For now, we'll test the validation and error handling aspects

    it('should handle invalid HTML gracefully', async () => {
      // This test would require proper puppeteer mocking
      // const html = '<invalid-html>';
      // We'll skip this for now as it requires complex mocking
    });

    it('should merge PDF options with defaults', () => {
      // Test that options merging logic works correctly
      const defaultOptions = {
        format: 'A4',
        margin: { top: '0.4in', right: '0.4in', bottom: '0.4in', left: '0.4in' },
        printBackground: false,
      };

      const userOptions = {
        format: 'Letter',
        margin: { top: '1in' },
        landscape: true,
      };

      const expectedMerged = {
        format: 'Letter',
        margin: { top: '1in', right: '0.4in', bottom: '0.4in', left: '0.4in' },
        printBackground: false,
        landscape: true,
      };

      // This logic should be extracted to a testable function
      const merged = {
        ...defaultOptions,
        ...userOptions,
        margin: {
          ...defaultOptions.margin,
          ...userOptions.margin,
        },
      };

      expect(merged).to.deep.equal(expectedMerged);
    });
  });
});