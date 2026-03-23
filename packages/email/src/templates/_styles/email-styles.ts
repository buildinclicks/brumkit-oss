/**
 * Common styles for Brumkit emails
 */

export const colors = {
  background: '#f6f9fc',
  container: '#ffffff',
  text: '#333333',
  muted: '#8898aa',
  primary: '#000000',
  secondary: '#5469d4', // Stripe-like blue for links
  border: '#e6ebf1',
  error: '#dc2626',
};

export const main = {
  backgroundColor: colors.background,
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

export const container = {
  backgroundColor: colors.container,
  margin: '0 auto',
  padding: '20px 0 48px',
  marginBottom: '64px',
  maxWidth: '600px',
};

export const box = {
  padding: '0 48px',
};

export const h1 = {
  color: colors.text,
  fontSize: '24px',
  fontWeight: 'bold',
  margin: '40px 0',
  padding: '0',
  textAlign: 'center' as const,
};

export const h2 = {
  color: colors.text,
  fontSize: '20px',
  fontWeight: 'bold',
  margin: '30px 0',
  padding: '0',
};

export const text = {
  color: colors.text,
  fontSize: '16px',
  lineHeight: '26px',
  margin: '16px 0',
};

export const button = {
  backgroundColor: colors.primary,
  borderRadius: '5px',
  color: '#ffffff',
  fontSize: '16px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'block',
  width: '100%',
  padding: '12px',
  margin: '24px 0',
};

export const link = {
  color: colors.secondary,
  fontSize: '14px',
  textDecoration: 'underline',
  wordBreak: 'break-all' as const,
};

export const hr = {
  borderColor: colors.border,
  margin: '20px 0',
};

export const footer = {
  color: colors.muted,
  fontSize: '12px',
  lineHeight: '16px',
};

export const infoBox = {
  backgroundColor: '#f8f9fa',
  borderRadius: '8px',
  margin: '24px 0',
  padding: '16px',
};

export const infoText = {
  color: colors.text,
  fontSize: '14px',
  lineHeight: '22px',
  margin: '4px 0',
};
