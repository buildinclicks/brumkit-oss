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

interface VerificationEmailProps {
  name: string;
  verificationLink: string;
}

export function VerificationEmail({
  name,
  verificationLink,
}: VerificationEmailProps) {
  return (
    <Html>
      <Head />
      <Body style={main}>
        <Container style={container}>
          <Section style={box}>
            <Heading style={h1}>Welcome to Brumkit! 👋</Heading>

            <Text style={text}>Hi {name},</Text>

            <Text style={text}>
              Thanks for signing up! To get the most out of Brumkit, please
              verify your email address.
            </Text>

            <Button href={verificationLink} style={button}>
              Verify Email Address
            </Button>

            <Text style={text}>
              Or copy and paste this link into your browser:
            </Text>

            <Text style={link}>{verificationLink}</Text>

            <Hr style={hr} />

            <Text style={footer}>
              This link will expire in 24 hours. If you didn't create an
              account, you can safely ignore this email.
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

const list = {
  color: '#333',
  fontSize: '16px',
  lineHeight: '26px',
  paddingLeft: '20px',
};

const button = {
  backgroundColor: '#000',
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
};

export default VerificationEmail;
