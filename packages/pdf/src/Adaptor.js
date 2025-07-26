import { expandReferences } from '@openfn/language-common/util';
import * as util from './Utils';
import Handlebars from 'handlebars';
import puppeteer from 'puppeteer';
import { readFileSync } from 'fs';
import { resolve } from 'path';

/**
 * State object
 * @typedef {Object} PdfState
 * @property {Object} data - JSON data to be merged with template
 * @property {Buffer} pdfBuffer - Generated PDF as binary buffer
 * @property {string} pdfBase64 - Generated PDF as base64 string
 * @property {Object} response - Response metadata from PDF generation
 * @property {Array} references - Array of all previous data objects used in the Job
 */

/**
 * Generate PDF from HTML template and JSON data
 * @example
 * generatePdf({
 *   template: '<html><body><h1>{{title}}</h1><p>{{content}}</p></body></html>',
 *   data: { title: 'My Report', content: 'Report content here' },
 *   pdfOptions: { format: 'A4', margin: { top: '1in' } }
 * });
 * @example
 * generatePdf({
 *   templatePath: './templates/report.html',
 *   pdfOptions: { format: 'Letter', landscape: true }
 * });
 * @function
 * @public
 * @param {Object} options - Configuration options
 * @param {string} options.template - HTML template string (overrides configuration template)
 * @param {string} options.templatePath - Path to HTML template file (overrides configuration templatePath)
 * @param {Object} options.data - Data to merge with template (overrides state.data)
 * @param {Object} options.pdfOptions - PDF generation options (merges with configuration pdfOptions)
 * @returns {Operation}
 * @state {PdfState}
 */
export function generatePdf(options = {}) {
  return async state => {
    const [resolvedOptions] = expandReferences(state, options);

    try {
      // Merge data from options or use state.data
      const data = resolvedOptions.data || state.data || {};

      // Get template from various sources
      const template = await util.getTemplate(state, resolvedOptions);

      // Compile template with Handlebars
      const compiledTemplate = Handlebars.compile(template);
      const html = compiledTemplate(data);

      // Merge PDF options
      const pdfOptions = {
        ...state.configuration?.pdfOptions,
        ...resolvedOptions.pdfOptions,
      };

      // Generate PDF
      const pdfBuffer = await util.generatePdfFromHtml(html, pdfOptions);

      // Convert to base64
      const pdfBase64 = pdfBuffer.toString('base64');

      // Prepare response metadata
      const response = {
        success: true,
        timestamp: new Date().toISOString(),
        pdfSize: pdfBuffer.length,
        pdfOptions,
      };

      return {
        ...state,
        data,
        pdfBuffer,
        pdfBase64,
        response,
        references: [response, ...state.references || []],
      };

    } catch (error) {
      throw new Error(`PDF generation failed: ${error.message}`);
    }
  };
}

export {
  as,
  combine,
  cursor,
  dataPath,
  dataValue,
  dateFns,
  each,
  field,
  fields,
  fn,
  fnIf,
  group,
  lastReferenceValue,
  map,
  merge,
  scrubEmojis,
  sourceValue,
  util,
} from '@openfn/language-common';