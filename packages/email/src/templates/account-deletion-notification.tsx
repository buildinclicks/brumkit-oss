import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components';

interface AccountDeletionNotificationEmailProps {
  userName?: string;
}

export const AccountDeletionNotificationEmail = ({
  userName = 'User',
}: AccountDeletionNotificationEmailProps) => (
  <Html>
    <Head />
    <Preview>Your account has been scheduled for deletion</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>Account Deletion Scheduled</Heading>

        <Text style={text}>Hi {userName},</Text>

        <Text style={text}>
          Your account has been scheduled for deletion. Your account and all
          associated data will be permanently deleted in{' '}
          <strong>30 days</strong>.
        </Text>

        <Section style={warningBox}>
          <Text style={warningText}>
            ⚠️ <strong>Grace Period:</strong> You have 30 days to cancel this
            action. Simply log in to your account within this period to restore
            it.
          </Text>
        </Section>

        <Heading as="h2" style={h2}>
          What happens during the 30-day grace period?
        </Heading>

        <Text style={text}>
          • Your account is deactivated and not publicly visible
          <br />
          • You cannot log in or access your account
          <br />
          • You can restore your account by contacting support
          <br />
        </Text>

        <Heading as="h2" style={h2}>
          What happens after 30 days?
        </Heading>

        <Text style={text}>
          • Your personal information (email, name, bio) will be permanently
          removed
          <br />
          • Your content (articles, comments) will be anonymized (author changed
          to "Deleted User")
          <br />
          • This action cannot be undone
          <br />
        </Text>

        <Section style={infoBox}>
          <Text style={infoText}>
            <strong>Didn't request this?</strong> If you didn't request account
            deletion, please contact our support team immediately at{' '}
            <Link href="mailto:support@example.com" style={link}>
              support@example.com
            </Link>
          </Text>
        </Section>

        <Text style={footer}>
          This is an automated email. Please do not reply to this message.
        </Text>
      </Container>
    </Body>
  </Html>
);

export default AccountDeletionNotificationEmail;

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

const h2 = {
  color: '#333',
  fontSize: '18px',
  fontWeight: 'bold',
  margin: '30px 0 15px',
  padding: '0 48px',
};

const text = {
  color: '#333',
  fontSize: '16px',
  lineHeight: '26px',
  padding: '0 48px',
  margin: '16px 0',
};

const warningBox = {
  backgroundColor: '#fff3cd',
  border: '1px solid #ffc107',
  borderRadius: '5px',
  margin: '24px 48px',
  padding: '16px',
};

const warningText = {
  color: '#856404',
  fontSize: '14px',
  lineHeight: '24px',
  margin: '0',
};

const infoBox = {
  backgroundColor: '#e7f3ff',
  border: '1px solid #2196f3',
  borderRadius: '5px',
  margin: '24px 48px',
  padding: '16px',
};

const infoText = {
  color: '#0c5460',
  fontSize: '14px',
  lineHeight: '24px',
  margin: '0',
};

const link = {
  color: '#2196f3',
  textDecoration: 'underline',
};

const footer = {
  color: '#8898aa',
  fontSize: '12px',
  lineHeight: '16px',
  padding: '0 48px',
  marginTop: '32px',
};
