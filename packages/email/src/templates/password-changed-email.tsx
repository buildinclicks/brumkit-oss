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

interface PasswordChangedEmailProps {
  name: string;
  loginLink: string;
}

export function PasswordChangedEmail({
  name,
  loginLink,
}: PasswordChangedEmailProps) {
  return (
    <Html>
      <Head />
      <Body style={main}>
        <Container style={container}>
          <Section style={box}>
            <Heading style={h1}>Password Changed Successfully ✅</Heading>

            <Text style={text}>Hi {name},</Text>

            <Text style={text}>
              This is a confirmation that your password for your React Masters
              account was just changed.
            </Text>

            <Text style={text}>
              <strong>What this means:</strong>
            </Text>

            <ul style={list}>
              <li>Your old password will no longer work</li>
              <li>Use your new password to sign in</li>
              <li>
                All active sessions on other devices will remain logged in
              </li>
            </ul>

            <Text style={text}>
              You can sign in with your new password here:
            </Text>

            <Button href={loginLink} style={button}>
              Sign In to Your Account
            </Button>

            <Hr style={hr} />

            <Text style={securityNote}>
              <strong>🔒 Security Notice:</strong>
            </Text>

            <Text style={text}>
              If you didn't make this change, someone else may have accessed
              your account. Please contact our support team immediately and
              consider:
            </Text>

            <ul style={list}>
              <li>Resetting your password again</li>
              <li>Checking your recent account activity</li>
              <li>Enabling two-factor authentication (if available)</li>
            </ul>

            <Hr style={hr} />

            <Text style={footer}>
              This is an automated security notification. For your protection,
              we send this email whenever your password is changed.
            </Text>

            <Text style={footer}>
              If you have any concerns, please contact our support team.
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
  backgroundColor: '#16a34a', // Green color for success
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

const securityNote = {
  color: '#dc2626',
  fontSize: '16px',
  fontWeight: 'bold',
  lineHeight: '26px',
  marginTop: '20px',
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

export default PasswordChangedEmail;
