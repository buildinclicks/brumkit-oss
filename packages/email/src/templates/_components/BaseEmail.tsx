import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
} from '@react-email/components';
import * as React from 'react';
import * as styles from '../_styles/email-styles';

interface BaseEmailProps {
  previewText?: string;
  heading?: string;
  children: React.ReactNode;
}

export const BaseEmail = ({
  previewText,
  heading,
  children,
}: BaseEmailProps) => {
  return (
    <Html>
      <Head />
      {previewText && <Preview>{previewText}</Preview>}
      <Body style={styles.main}>
        <Container style={styles.container}>
          <Section style={styles.box}>
            {heading && <Heading style={styles.h1}>{heading}</Heading>}
            {children}
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

export default BaseEmail;
