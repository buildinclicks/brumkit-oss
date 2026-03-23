import { Button, Text, Hr } from '@react-email/components';
import { BaseEmail } from './_components/BaseEmail';
import * as styles from './_styles/email-styles';

interface WelcomeEmailProps {
  name: string;
  dashboardLink: string;
}

export const WelcomeEmail = ({ name, dashboardLink }: WelcomeEmailProps) => {
  return (
    <BaseEmail
      previewText="Welcome to Brumkit!"
      heading="Welcome to Brumkit! 🎉"
    >
      <Text style={styles.text}>Hi {name},</Text>

      <Text style={styles.text}>
        Your email has been verified! You now have full access to all Brumkit
        features.
      </Text>

      <Button href={dashboardLink} style={styles.button}>
        Go to Dashboard
      </Button>

      <Hr style={styles.hr} />

      <Text style={styles.footer}>
        Need help? Reply to this email or visit our help center.
      </Text>
    </BaseEmail>
  );
};

export default WelcomeEmail;
