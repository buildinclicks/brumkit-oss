import { Button, Text, Hr, Link, Section } from '@react-email/components';
import { BaseEmail } from './_components/BaseEmail';
import * as styles from './_styles/email-styles';

interface EmailChangeVerificationProps {
  name: string;
  verificationLink: string;
}

export const EmailChangeVerification = ({
  name,
  verificationLink,
}: EmailChangeVerificationProps) => {
  return (
    <BaseEmail
      previewText="Verify your new email address for Brumkit"
      heading="Verify Your New Email"
    >
      <Text style={styles.text}>Hi {name},</Text>

      <Text style={styles.text}>
        You recently requested to change your email address for your Brumkit
        account.
      </Text>

      <Text style={styles.text}>
        Click the button below to verify your new email address and complete the
        change:
      </Text>

      <Section
        style={{
          padding: '24px 0',
          textAlign: 'center' as const,
        }}
      >
        <Button href={verificationLink} style={styles.button}>
          Verify New Email
        </Button>
      </Section>

      <Text style={styles.text}>
        Or copy and paste this link into your browser:
      </Text>

      <Text style={styles.link}>{verificationLink}</Text>

      <Hr style={styles.hr} />

      <Text style={styles.footer}>
        This link will expire in 1 hour for security reasons.
      </Text>

      <Text style={styles.footer}>
        If you didn't request this email change, please ignore this email and
        secure your account immediately.
      </Text>

      <Text style={styles.footer}>
        <Link href="https://brumkit.com" style={styles.link}>
          Brumkit
        </Link>
      </Text>
    </BaseEmail>
  );
};

export default EmailChangeVerification;
