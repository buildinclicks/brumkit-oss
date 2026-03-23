import { Button, Text, Hr } from '@react-email/components';
import { BaseEmail } from './_components/BaseEmail';
import * as styles from './_styles/email-styles';

interface VerificationEmailProps {
  name: string;
  verificationLink: string;
}

export const VerificationEmail = ({
  name,
  verificationLink,
}: VerificationEmailProps) => {
  return (
    <BaseEmail
      previewText="Verify your email address for Brumkit"
      heading="Welcome to Brumkit! 👋"
    >
      <Text style={styles.text}>Hi {name},</Text>

      <Text style={styles.text}>
        Thanks for signing up! To get the most out of Brumkit, please verify
        your email address.
      </Text>

      <Button href={verificationLink} style={styles.button}>
        Verify Email Address
      </Button>

      <Text style={styles.text}>
        Or copy and paste this link into your browser:
      </Text>

      <Text style={styles.link}>{verificationLink}</Text>

      <Hr style={styles.hr} />

      <Text style={styles.footer}>
        This link will expire in 24 hours. If you didn't create an account, you
        can safely ignore this email.
      </Text>
    </BaseEmail>
  );
};

export default VerificationEmail;
