import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Heading,
  Text,
  Button,
  Hr,
} from '@react-email/components';

interface PasswordResetEmailProps {
  name: string;
  resetLink: string;
}

export function PasswordResetEmail({
  name,
  resetLink,
}: PasswordResetEmailProps) {
  return (
    <Html>
      <Head />
      <Body style={main}>
        <Container style={container}>
          <Section style={box}>
            <Heading style={h1}>Reset Your Password 🔐</Heading>

            <Text style={text}>Hi {name},</Text>

            <Text style={text}>
              We received a request to reset your password for your React
              Masters account. Click the button below to choose a new password.
            </Text>

            <Button href={resetLink} style={button}>
              Reset Password
            </Button>

            <Text style={text}>
              Or copy and paste this link into your browser:
            </Text>

            <Text style={link}>{resetLink}</Text>

            <Hr style={hr} />

            <Text style={footer}>
              This link will expire in 1 hour for security reasons. If you
              didn't request a password reset, you can safely ignore this email
              - your password will not be changed.
            </Text>

            <Text style={footer}>
              For security, never share this link with anyone.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

// Styles
const main = {
  backgroundColor: '#f6f9fc',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0 48px',
  marginBottom: '64px',
};

const box = {
  padding: '0 48px',
};

const h1 = {
  color: '#333',
  fontSize: '24px',
  fontWeight: 'bold',
  margin: '40px 0',
  padding: '0',
};

const text = {
  color: '#333',
  fontSize: '16px',
  lineHeight: '26px',
};

const button = {
  backgroundColor: '#dc2626', // Red color for password reset
  borderRadius: '5px',
  color: '#fff',
  fontSize: '16px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'block',
  width: '100%',
  padding: '12px',
  margin: '24px 0',
};

const link = {
  color: '#0070f3',
  fontSize: '14px',
  textDecoration: 'underline',
  wordBreak: 'break-all' as const,
};

const hr = {
  borderColor: '#e6ebf1',
  margin: '20px 0',
};

const footer = {
  color: '#8898aa',
  fontSize: '12px',
  lineHeight: '16px',
  marginTop: '8px',
};

export default PasswordResetEmail;
