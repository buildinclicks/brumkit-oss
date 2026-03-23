import { Text, Section } from '@react-email/components';
import { BaseEmail } from './_components/BaseEmail';
import * as styles from './_styles/email-styles';

interface AdminDeletionSummaryEmailProps {
  deletedCount: number;
  date: string;
  deletedUsers: Array<{
    id: string;
    email: string;
    deletedAt: string;
  }>;
}

export const AdminDeletionSummaryEmail = ({
  deletedCount,
  date,
  deletedUsers,
}: AdminDeletionSummaryEmailProps) => {
  return (
    <BaseEmail
      previewText={`Account Deletion Summary: ${deletedCount} account(s) deleted`}
      heading="Account Deletion Summary"
    >
      <Text style={styles.text}>
        <strong>Date:</strong> {date}
      </Text>
      <Text style={styles.text}>
        <strong>Accounts Deleted:</strong> {deletedCount}
      </Text>

      {deletedCount > 0 && (
        <Section style={{ margin: '24px 0' }}>
          <table
            style={{
              width: '100%',
              borderCollapse: 'collapse',
            }}
          >
            <thead>
              <tr style={{ backgroundColor: '#f8f9fa' }}>
                <th
                  style={{
                    padding: '12px',
                    textAlign: 'left',
                    fontSize: '14px',
                    fontWeight: 'bold',
                    color: '#333',
                    borderBottom: '2px solid #dee2e6',
                  }}
                >
                  User ID
                </th>
                <th
                  style={{
                    padding: '12px',
                    textAlign: 'left',
                    fontSize: '14px',
                    fontWeight: 'bold',
                    color: '#333',
                    borderBottom: '2px solid #dee2e6',
                  }}
                >
                  Email
                </th>
                <th
                  style={{
                    padding: '12px',
                    textAlign: 'left',
                    fontSize: '14px',
                    fontWeight: 'bold',
                    color: '#333',
                    borderBottom: '2px solid #dee2e6',
                  }}
                >
                  Deleted At
                </th>
              </tr>
            </thead>
            <tbody>
              {deletedUsers.map((user) => (
                <tr key={user.id} style={{ borderBottom: '1px solid #dee2e6' }}>
                  <td
                    style={{
                      padding: '12px',
                      fontSize: '14px',
                      color: '#333',
                    }}
                  >
                    {user.id}
                  </td>
                  <td
                    style={{
                      padding: '12px',
                      fontSize: '14px',
                      color: '#333',
                    }}
                  >
                    {user.email}
                  </td>
                  <td
                    style={{
                      padding: '12px',
                      fontSize: '14px',
                      color: '#333',
                    }}
                  >
                    {user.deletedAt}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Section>
      )}

      <Section style={styles.infoBox}>
        <Text style={styles.infoText}>
          <strong>Data Retention Policy:</strong>
        </Text>
        <Text style={styles.infoText}>
          • Personal information (PII) has been permanently deleted
        </Text>
        <Text style={styles.infoText}>
          • Anonymized records retained for analytics
        </Text>
        <Text style={styles.infoText}>
          • 30-day grace period has elapsed for all deleted accounts
        </Text>
      </Section>

      <Text style={styles.footer}>
        This is an automated cron job notification. Scheduled daily at 2 AM UTC.
      </Text>
    </BaseEmail>
  );
};

export default AdminDeletionSummaryEmail;
