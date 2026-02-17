import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Text,
} from '@react-email/components';

interface EmailChangeNotificationProps {
  name: string;
  newEmail: string;
}

export const EmailChangeNotification = ({
  name,
  newEmail,
}: EmailChangeNotificationProps) => (
  <Html>
    <Head />
    <Preview>Security notification: Email address change requested</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>Email Change Request</Heading>
        <Text style={text}>Hi {name},</Text>
        <Text style={text}>
          This is a security notification to inform you that someone requested
          to change your React Masters account email address.
        </Text>
        <Text style={alertText}>
          <strong>New email address:</strong> {newEmail}
        </Text>
        <Text style={text}>
          A verification link has been sent to the new email address. Your email
          will only be changed after the new address is verified.
        </Text>
        <Hr style={hr} />
        <Text style={warningText}>
          ⚠️ <strong>If you didn't request this change:</strong>
        </Text>
        <Text style={text}>
          Please secure your account immediately by changing your password and
          enabling two-factor authentication if you haven't already.
        </Text>
        <Text style={text}>
          If you're having trouble, please contact our support team at{' '}
          <Link href="mailto:support@reactmasters.com" style={link}>
            support@reactmasters.com
          </Link>
        </Text>
        <Hr style={hr} />
        <Text style={footer}>
          This is an automated security notification from React Masters.
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

export default EmailChangeNotification;

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

const alertText = {
  color: '#333',
  fontSize: '16px',
  lineHeight: '26px',
  padding: '16px 40px',
  backgroundColor: '#fff3cd',
  borderLeft: '4px solid #ffc107',
  margin: '20px 0',
};

const warningText = {
  color: '#d93025',
  fontSize: '16px',
  lineHeight: '26px',
  padding: '16px 40px',
  fontWeight: 'bold' as const,
};

const link = {
  color: '#5469d4',
  fontSize: '14px',
  textDecoration: 'underline',
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
