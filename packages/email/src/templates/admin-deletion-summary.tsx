import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
} from '@react-email/components';

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
    <Html>
      <Head />
      <Preview>
        Account Deletion Summary: {deletedCount.toString()} account(s) deleted
      </Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Account Deletion Summary</Heading>
          <Text style={text}>
            <strong>Date:</strong> {date}
          </Text>
          <Text style={text}>
            <strong>Accounts Deleted:</strong> {deletedCount}
          </Text>

          {deletedCount > 0 && (
            <Section style={tableContainer}>
              <table style={table}>
                <thead>
                  <tr style={tableHeader}>
                    <th style={tableHeaderCell}>User ID</th>
                    <th style={tableHeaderCell}>Email</th>
                    <th style={tableHeaderCell}>Deleted At</th>
                  </tr>
                </thead>
                <tbody>
                  {deletedUsers.map((user) => (
                    <tr key={user.id} style={tableRow}>
                      <td style={tableCell}>{user.id}</td>
                      <td style={tableCell}>{user.email}</td>
                      <td style={tableCell}>{user.deletedAt}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Section>
          )}

          <Section style={infoBox}>
            <Text style={infoText}>
              <strong>Data Retention Policy:</strong>
            </Text>
            <Text style={infoText}>
              • Personal information (PII) has been permanently deleted
            </Text>
            <Text style={infoText}>
              • Anonymized records retained for analytics
            </Text>
            <Text style={infoText}>
              • 30-day grace period has elapsed for all deleted accounts
            </Text>
          </Section>

          <Text style={footer}>
            This is an automated cron job notification. Scheduled daily at 2 AM
            UTC.
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

AdminDeletionSummaryEmail.PreviewProps = {
  deletedCount: 2,
  date: '2026-01-15',
  deletedUsers: [
    {
      id: 'user_123',
      email: 'user1@example.com',
      deletedAt: '2025-12-15',
    },
    {
      id: 'user_456',
      email: 'user2@example.com',
      deletedAt: '2025-12-14',
    },
  ],
} as AdminDeletionSummaryEmailProps;

export default AdminDeletionSummaryEmail;

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
  maxWidth: '800px',
};

const h1 = {
  color: '#333',
  fontSize: '24px',
  fontWeight: 'bold',
  margin: '40px 0',
  padding: '0 48px',
};

const text = {
  color: '#333',
  fontSize: '16px',
  lineHeight: '26px',
  margin: '16px 0',
  padding: '0 48px',
};

const tableContainer = {
  margin: '24px 48px',
};

const table = {
  width: '100%',
  borderCollapse: 'collapse' as const,
};

const tableHeader = {
  backgroundColor: '#f8f9fa',
};

const tableHeaderCell = {
  padding: '12px',
  textAlign: 'left' as const,
  fontSize: '14px',
  fontWeight: 'bold',
  color: '#333',
  borderBottom: '2px solid #dee2e6',
};

const tableRow = {
  borderBottom: '1px solid #dee2e6',
};

const tableCell = {
  padding: '12px',
  fontSize: '14px',
  color: '#333',
};

const infoBox = {
  backgroundColor: '#f8f9fa',
  borderRadius: '8px',
  margin: '24px 48px',
  padding: '16px',
};

const infoText = {
  color: '#333',
  fontSize: '14px',
  lineHeight: '22px',
  margin: '4px 0',
};

const footer = {
  color: '#8898aa',
  fontSize: '12px',
  lineHeight: '16px',
  margin: '32px 0 0',
  padding: '0 48px',
};
