import { Button, Text, Hr } from '@react-email/components';
import { BaseEmail } from './_components/BaseEmail';
import * as styles from './_styles/email-styles';

interface PasswordChangedEmailProps {
  name: string;
  loginLink: string;
}

export const PasswordChangedEmail = ({
  name,
  loginLink,
}: PasswordChangedEmailProps) => {
  return (
    <BaseEmail
      previewText="Your password has been changed"
      heading="Password Changed Successfully ✅"
    >
      <Text style={styles.text}>Hi {name},</Text>

      <Text style={styles.text}>
        This is a confirmation that your password for your Brumkit account was
        just changed.
      </Text>

      <Text style={styles.text}>
        <strong>What this means:</strong>
      </Text>

      <ul
        style={{
          ...styles.text,
          paddingLeft: '20px',
        }}
      >
        <li>Use your new password to sign in</li>
        <li>All active sessions on other devices will remain logged in</li>
      </ul>

      <Text style={styles.text}>
        You can sign in with your new password here:
      </Text>

      <Button
        href={loginLink}
        style={{ ...styles.button, backgroundColor: '#16a34a' }}
      >
        Sign In to Your Account
      </Button>

      <Hr style={styles.hr} />

      <Text
        style={{
          ...styles.text,
          color: styles.colors.error,
          fontWeight: 'bold',
        }}
      >
        🔒 Security Notice:
      </Text>

      <Text style={styles.text}>
        If you didn't make this change, someone else may have accessed your
        account. Please contact our support team immediately and consider:
      </Text>

      <ul
        style={{
          ...styles.text,
          paddingLeft: '20px',
        }}
      >
        <li>Resetting your password again</li>
        <li>Checking your recent account activity</li>
        <li>Enabling two-factor authentication (if available)</li>
      </ul>

      <Hr style={styles.hr} />

      <Text style={styles.footer}>
        This is an automated security notification. For your protection, we send
        this email whenever your password is changed.
      </Text>

      <Text style={styles.footer}>
        If you have any concerns, please contact our support team.
      </Text>
    </BaseEmail>
  );
};

export default PasswordChangedEmail;
