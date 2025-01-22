export default function formatCurrency(value, currency = 'USD', locale = 'en-US') {
    if (isNaN(value)) {
      throw new Error('Value must be a number');
    }
  
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
    }).format(value);
  }
  