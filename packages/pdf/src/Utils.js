import puppeteer from 'puppeteer';
import { readFileSync } from 'fs';
import { resolve, isAbsolute } from 'path';

/**
 * Get template content from various sources
 * @param {Object} state - OpenFn state object
 * @param {Object} options - Options passed to generatePdf
 * @returns {Promise<string>} Template HTML content
 */
export async function getTemplate(state, options) {
  // Priority: options.template > options.templatePath > state.configuration.template > state.configuration.templatePath
  
  if (options.template) {
    return options.template;
  }

  if (options.templatePath) {
    return readTemplateFile(options.templatePath);
  }

  if (state.configuration?.template) {
    return state.configuration.template;
  }

  if (state.configuration?.templatePath) {
    return readTemplateFile(state.configuration.templatePath);
  }

  throw new Error('No template provided. Set template string or templatePath in options or configuration.');
}

/**
 * Read template from file system
 * @param {string} templatePath - Path to template file
 * @returns {string} Template content
 */
function readTemplateFile(templatePath) {
  try {
    // Resolve path (make absolute if relative)
    const fullPath = isAbsolute(templatePath) ? templatePath : resolve(process.cwd(), templatePath);
    
    return readFileSync(fullPath, 'utf8');
  } catch (error) {
    throw new Error(`Failed to read template file at ${templatePath}: ${error.message}`);
  }
}

/**
 * Generate PDF from HTML using Puppeteer
 * @param {string} html - HTML content to convert to PDF
 * @param {Object} pdfOptions - PDF generation options
 * @returns {Promise<Buffer>} PDF as buffer
 */
export async function generatePdfFromHtml(html, pdfOptions = {}) {
  let browser;
  
  try {
    // Launch browser
    browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu',
      ],
    });

    const page = await browser.newPage();

    // Set content
    await page.setContent(html, {
      waitUntil: 'networkidle0', // Wait for network to be idle
    });

    // Prepare PDF options with defaults
    const defaultOptions = {
      format: 'A4',
      margin: {
        top: '0.4in',
        right: '0.4in', 
        bottom: '0.4in',
        left: '0.4in',
      },
      printBackground: false,
      displayHeaderFooter: false,
      landscape: false,
    };

    const finalOptions = {
      ...defaultOptions,
      ...pdfOptions,
      // Ensure margin is properly merged
      margin: {
        ...defaultOptions.margin,
        ...pdfOptions.margin,
      },
    };

    // Generate PDF
    const pdfBuffer = await page.pdf(finalOptions);

    return pdfBuffer;

  } catch (error) {
    throw new Error(`Puppeteer PDF generation failed: ${error.message}`);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

/**
 * Validate PDF options
 * @param {Object} options - PDF options to validate
 * @returns {Object} Validated options
 */
export function validatePdfOptions(options = {}) {
  const validFormats = ['A4', 'A3', 'A2', 'A1', 'A0', 'Letter', 'Legal', 'Tabloid', 'Ledger'];
  
  if (options.format && !validFormats.includes(options.format)) {
    throw new Error(`Invalid PDF format: ${options.format}. Valid formats: ${validFormats.join(', ')}`);
  }

  // Validate margin format if provided
  if (options.margin) {
    const marginKeys = ['top', 'right', 'bottom', 'left'];
    for (const key of marginKeys) {
      if (options.margin[key] && typeof options.margin[key] !== 'string') {
        throw new Error(`Margin ${key} must be a string (e.g., '1in', '20px', '2cm')`);
      }
    }
  }

  return options;
}