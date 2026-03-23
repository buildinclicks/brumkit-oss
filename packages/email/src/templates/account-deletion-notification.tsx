import { Text, Section, Link, Heading } from '@react-email/components';
import { BaseEmail } from './_components/BaseEmail';
import * as styles from './_styles/email-styles';

interface AccountDeletionNotificationEmailProps {
  userName?: string;
}

export const AccountDeletionNotificationEmail = ({
  userName = 'User',
}: AccountDeletionNotificationEmailProps) => {
  return (
    <BaseEmail
      previewText="Your account has been scheduled for deletion"
      heading="Account Deletion Scheduled"
    >
      <Text style={styles.text}>Hi {userName},</Text>

      <Text style={styles.text}>
        Your account has been scheduled for deletion. Your account and all
        associated data will be permanently deleted in <strong>30 days</strong>.
      </Text>

      <Section
        style={{
          backgroundColor: '#fff3cd',
          border: '1px solid #ffc107',
          borderRadius: '5px',
          margin: '24px 0',
          padding: '16px',
        }}
      >
        <Text
          style={{
            color: '#856404',
            fontSize: '14px',
            lineHeight: '24px',
            margin: '0',
          }}
        >
          ⚠️ <strong>Grace Period:</strong> You have 30 days to cancel this
          action. Simply log in to your account within this period to restore
          it.
        </Text>
      </Section>

      <Heading as="h2" style={styles.h2}>
        What happens during the 30-day grace period?
      </Heading>

      <Text style={styles.text}>
        • Your account is deactivated and not publicly visible
        <br />
        • You cannot log in or access your account
        <br />• You can restore your account by contacting support
      </Text>

      <Heading as="h2" style={styles.h2}>
        What happens after 30 days?
      </Heading>

      <Text style={styles.text}>
        • Your personal information (email, name, bio) will be permanently
        removed
        <br />
        • Your content (articles, comments) will be anonymized (author changed
        to "Deleted User")
        <br />• This action cannot be undone
      </Text>

      <Section
        style={{
          ...styles.infoBox,
          backgroundColor: '#e7f3ff',
          border: '1px solid #2196f3',
        }}
      >
        <Text
          style={{
            ...styles.infoText,
            color: '#0c5460',
          }}
        >
          <strong>Didn't request this?</strong> If you didn't request account
          deletion, please contact our support team immediately at{' '}
          <Link href="mailto:support@brumkit.com" style={styles.link}>
            support@brumkit.com
          </Link>
        </Text>
      </Section>

      <Text style={styles.footer}>
        This is an automated email. Please do not reply to this message.
      </Text>
    </BaseEmail>
  );
};

export default AccountDeletionNotificationEmail;
