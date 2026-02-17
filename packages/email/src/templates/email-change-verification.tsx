import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components';

interface EmailChangeVerificationProps {
  name: string;
  verificationLink: string;
}

export const EmailChangeVerification = ({
  name,
  verificationLink,
}: EmailChangeVerificationProps) => (
  <Html>
    <Head />
    <Preview>Verify your new email address for React Masters</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>Verify Your New Email</Heading>
        <Text style={text}>Hi {name},</Text>
        <Text style={text}>
          You recently requested to change your email address for your React
          Masters account.
        </Text>
        <Text style={text}>
          Click the button below to verify your new email address and complete
          the change:
        </Text>
        <Section style={buttonContainer}>
          <Button style={button} href={verificationLink}>
            Verify New Email
          </Button>
        </Section>
        <Text style={text}>Or copy and paste this URL into your browser:</Text>
        <Link href={verificationLink} style={link}>
          {verificationLink}
        </Link>
        <Hr style={hr} />
        <Text style={footer}>
          This link will expire in 1 hour for security reasons.
        </Text>
        <Text style={footer}>
          If you didn't request this email change, please ignore this email and
          secure your account immediately.
        </Text>
        <Text style={footer}>
          <Link href="https://reactmasters.com" style={link}>
            React Masters
          </Link>
        </Text>
      </Container>
    </Body>
  </Html>
);

export default EmailChangeVerification;

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
  maxWidth: '600px',
};

const h1 = {
  color: '#333',
  fontSize: '24px',
  fontWeight: 'bold',
  margin: '40px 0',
  padding: '0',
  textAlign: 'center' as const,
};

const text = {
  color: '#333',
  fontSize: '16px',
  lineHeight: '26px',
  padding: '0 40px',
};

const buttonContainer = {
  padding: '27px 0 27px',
  textAlign: 'center' as const,
};

const button = {
  backgroundColor: '#5469d4',
  borderRadius: '5px',
  color: '#fff',
  fontSize: '16px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'block',
  padding: '12px 40px',
};

const link = {
  color: '#5469d4',
  fontSize: '14px',
  textDecoration: 'underline',
  wordBreak: 'break-all' as const,
  padding: '0 40px',
};

const hr = {
  borderColor: '#e6ebf1',
  margin: '20px 0',
};

const footer = {
  color: '#8898aa',
  fontSize: '12px',
  lineHeight: '16px',
  padding: '0 40px',
  marginTop: '12px',
};
