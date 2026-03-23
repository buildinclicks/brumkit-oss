import { Button, Text, Hr } from '@react-email/components';
import { BaseEmail } from './_components/BaseEmail';
import * as styles from './_styles/email-styles';

interface PasswordResetEmailProps {
  name: string;
  resetLink: string;
}

export const PasswordResetEmail = ({
  name,
  resetLink,
}: PasswordResetEmailProps) => {
  return (
    <BaseEmail
      previewText="Reset your password for Brumkit"
      heading="Reset Your Password 🔐"
    >
      <Text style={styles.text}>Hi {name},</Text>

      <Text style={styles.text}>
        We received a request to reset your password for your Brumkit account.
        Click the button below to choose a new password.
      </Text>

      <Button href={resetLink} style={styles.button}>
        Reset Password
      </Button>

      <Text style={styles.text}>
        Or copy and paste this link into your browser:
      </Text>

      <Text style={styles.link}>{resetLink}</Text>

      <Hr style={styles.hr} />

      <Text style={styles.footer}>
        This link will expire in 1 hour for security reasons. If you didn't
        request a password reset, you can safely ignore this email - your
        password will not be changed.
      </Text>

      <Text style={styles.footer}>
        For security, never share this link with anyone.
      </Text>
    </BaseEmail>
  );
};

export default PasswordResetEmail;
