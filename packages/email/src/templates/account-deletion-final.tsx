import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
} from '@react-email/components';

interface AccountDeletionFinalEmailProps {
  userName: string;
}

export const AccountDeletionFinalEmail = ({
  userName,
}: AccountDeletionFinalEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>Your account has been permanently deleted</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Account Permanently Deleted</Heading>
          <Text style={text}>Hi {userName},</Text>
          <Text style={text}>
            Your account has been permanently deleted from our system as
            requested. All your personal data has been removed in accordance
            with our privacy policy.
          </Text>
          <Section style={infoBox}>
            <Text style={infoText}>
              <strong>What was deleted:</strong>
            </Text>
            <Text style={infoText}>• Personal information (name, email)</Text>
            <Text style={infoText}>• Profile data</Text>
            <Text style={infoText}>• Account credentials</Text>
            <Text style={infoText}>
              • All other personally identifiable information
            </Text>
          </Section>
          <Text style={text}>
            If you deleted your account by mistake or would like to rejoin our
            platform, you're welcome to create a new account at any time.
          </Text>
          <Text style={text}>
            Thank you for being part of our community. We're sorry to see you
            go!
          </Text>
          <Text style={footer}>
            This is an automated message. Please do not reply to this email.
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

AccountDeletionFinalEmail.PreviewProps = {
  userName: 'John Doe',
} as AccountDeletionFinalEmailProps;

export default AccountDeletionFinalEmail;

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
  padding: '0 48px',
};

const text = {
  color: '#333',
  fontSize: '16px',
  lineHeight: '26px',
  margin: '16px 0',
  padding: '0 48px',
};

const infoBox = {
  backgroundColor: '#f8f9fa',
  borderRadius: '8px',
  margin: '24px 48px',
  padding: '16px',
};

const infoText = {
  color: '#333',
  fontSize: '14px',
  lineHeight: '22px',
  margin: '4px 0',
};

const footer = {
  color: '#8898aa',
  fontSize: '12px',
  lineHeight: '16px',
  margin: '32px 0 0',
  padding: '0 48px',
};
