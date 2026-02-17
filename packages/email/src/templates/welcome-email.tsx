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

interface WelcomeEmailProps {
  name: string;
  dashboardLink: string;
}

export function WelcomeEmail({ name, dashboardLink }: WelcomeEmailProps) {
  return (
    <Html>
      <Head />
      <Body style={main}>
        <Container style={container}>
          <Section style={box}>
            <Heading style={h1}>Welcome to React Masters! 🎉</Heading>

            <Text style={text}>Hi {name},</Text>

            <Text style={text}>
              Your email has been verified! You now have full access to all
              React Masters features.
            </Text>

            <Text style={text}>
              <strong>Get started:</strong>
            </Text>

            <ul style={list}>
              <li>Write your first article</li>
              <li>Explore trending posts</li>
              <li>Follow interesting authors</li>
              <li>Join discussions</li>
            </ul>

            <Button href={dashboardLink} style={button}>
              Go to Dashboard
            </Button>

            <Hr style={hr} />

            <Text style={footer}>
              Need help? Reply to this email or visit our help center.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

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

const hr = {
  borderColor: '#e6ebf1',
  margin: '20px 0',
};

const footer = {
  color: '#8898aa',
  fontSize: '12px',
  lineHeight: '16px',
};

export default WelcomeEmail;
