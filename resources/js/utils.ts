/**
 * Format a number as currency
 * @param amount - The amount to format
 * @param currencyCode - The currency code (default: USD)
 * @returns Formatted currency string
 */
export const formatCurrency = (amount: number, currencyCode = 'USD'): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currencyCode,
  }).format(amount);
};

/**
 * Format a date string
 * @param dateString - The date string to format
 * @param options - Intl.DateTimeFormatOptions
 * @returns Formatted date string
 */
export const formatDate = (dateString: string, options: Intl.DateTimeFormatOptions = {}): string => {
  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    ...options,
  };
  
  return new Date(dateString).toLocaleDateString('en-US', defaultOptions);
};

/**
 * Truncate a string to a specified length
 * @param str - The string to truncate
 * @param length - Maximum length
 * @param ending - String to append at the end (default: '...')
 * @returns Truncated string
 */
export const truncateString = (str: string, length: number, ending = '...'): string => {
  if (str.length <= length) return str;
  return str.substring(0, length - ending.length) + ending;
};

/**
 * Convert snake_case to Title Case
 * @param str - The snake_case string
 * @returns Title Case string
 */
export const snakeToTitleCase = (str: string): string => {
  return str
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

/**
 * Format a file size in bytes to a human-readable string
 * @param bytes - The file size in bytes
 * @returns Formatted file size string
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};