import { Text, Section } from '@react-email/components';
import { BaseEmail } from './_components/BaseEmail';
import * as styles from './_styles/email-styles';

interface AccountDeletionFinalEmailProps {
  userName: string;
}

export const AccountDeletionFinalEmail = ({
  userName,
}: AccountDeletionFinalEmailProps) => {
  return (
    <BaseEmail
      previewText="Your account has been permanently deleted"
      heading="Account Permanently Deleted"
    >
      <Text style={styles.text}>Hi {userName},</Text>

      <Text style={styles.text}>
        Your account has been permanently deleted from our system as requested.
        All your personal data has been removed in accordance with our privacy
        policy.
      </Text>

      <Section style={styles.infoBox}>
        <Text style={styles.infoText}>
          <strong>What was deleted:</strong>
        </Text>
        <Text style={styles.infoText}>
          • Personal information (name, email)
        </Text>
        <Text style={styles.infoText}>• Profile data</Text>
        <Text style={styles.infoText}>• Account credentials</Text>
        <Text style={styles.infoText}>
          • All other personally identifiable information
        </Text>
      </Section>

      <Text style={styles.text}>
        If you deleted your account by mistake or would like to rejoin our
        platform, you're welcome to create a new account at any time.
      </Text>

      <Text style={styles.text}>
        Thank you for being part of our community. We're sorry to see you go!
      </Text>

      <Text style={styles.footer}>
        This is an automated message. Please do not reply to this email.
      </Text>
    </BaseEmail>
  );
};

export default AccountDeletionFinalEmail;
