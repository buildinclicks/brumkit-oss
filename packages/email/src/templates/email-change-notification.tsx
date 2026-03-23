import { Text, Hr, Link } from '@react-email/components';
import { BaseEmail } from './_components/BaseEmail';
import * as styles from './_styles/email-styles';

interface EmailChangeNotificationProps {
  name: string;
  newEmail: string;
}

export const EmailChangeNotification = ({
  name,
  newEmail,
}: EmailChangeNotificationProps) => {
  return (
    <BaseEmail
      previewText="Security notification: Email address change requested"
      heading="Email Change Request"
    >
      <Text style={styles.text}>Hi {name},</Text>

      <Text style={styles.text}>
        This is a security notification to inform you that someone requested to
        change your Brumkit account email address.
      </Text>

      <Text
        style={{
          ...styles.text,
          padding: '16px',
          backgroundColor: '#fff3cd',
          borderLeft: '4px solid #ffc107',
          margin: '20px 0',
        }}
      >
        <strong>New email address:</strong> {newEmail}
      </Text>

      <Text style={styles.text}>
        A verification link has been sent to the new email address. Your email
        will only be changed after the new address is verified.
      </Text>

      <Hr style={styles.hr} />

      <Text
        style={{
          ...styles.text,
          color: '#d93025',
          fontWeight: 'bold',
        }}
      >
        ⚠️ If you didn't request this change:
      </Text>

      <Text style={styles.text}>
        Please secure your account immediately by changing your password and
        enabling two-factor authentication if you haven't already.
      </Text>

      <Text style={styles.text}>
        If you're having trouble, please contact our support team at{' '}
        <Link href="mailto:support@brumkit.com" style={styles.link}>
          support@brumkit.com
        </Link>
      </Text>

      <Hr style={styles.hr} />

      <Text style={styles.footer}>
        This is an automated security notification from Brumkit.
      </Text>

      <Text style={styles.footer}>
        <Link href="https://brumkit.com" style={styles.link}>
          Brumkit
        </Link>
      </Text>
    </BaseEmail>
  );
};

export default EmailChangeNotification;
