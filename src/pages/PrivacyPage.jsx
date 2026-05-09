import React from 'react';
import styled from 'styled-components';

const Page = styled.div`
  min-height: calc(100vh - 64px);
  padding-top: 64px;
  background: #f8fafc;
  font-family: 'Inter', sans-serif;
`;

const Shell = styled.div`
  max-width: 760px;
  margin: 0 auto;
  padding: 3rem 1.5rem 4rem;

  @media (max-width: 640px) {
    padding: 2rem 1.25rem 3rem;
  }
`;

const Eyebrow = styled.p`
  font-size: 0.68rem;
  font-weight: 800;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #15803d;
  margin: 0 0 0.6rem;
`;

const Title = styled.h1`
  font-family: 'Space Grotesk', sans-serif;
  font-size: clamp(1.6rem, 3vw, 2.2rem);
  font-weight: 800;
  color: #0a0f1e;
  margin: 0 0 0.5rem;
  letter-spacing: -0.02em;
`;

const Meta = styled.p`
  font-size: 0.8rem;
  color: #64748b;
  margin: 0 0 2.5rem;
`;

const Divider = styled.hr`
  border: none;
  border-top: 1px solid #e2e8f0;
  margin: 2rem 0;
`;

const H2 = styled.h2`
  font-family: 'Space Grotesk', sans-serif;
  font-size: 1.05rem;
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 0.6rem;
`;

const P = styled.p`
  font-size: 0.88rem;
  line-height: 1.72;
  color: #334155;
  margin: 0 0 1rem;
`;

const UL = styled.ul`
  margin: 0 0 1rem;
  padding-left: 1.3rem;

  li {
    font-size: 0.88rem;
    line-height: 1.72;
    color: #334155;
    margin-bottom: 0.3rem;
  }
`;

const ContactBox = styled.div`
  margin-top: 2rem;
  padding: 1.25rem 1.35rem;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  font-size: 0.85rem;
  color: #334155;
  line-height: 1.65;

  a {
    color: #15803d;
    text-decoration: none;
    font-weight: 600;
    &:hover { text-decoration: underline; }
  }
`;

const PrivacyPage = () => (
  <Page>
    <Shell>
      <Eyebrow>Legal</Eyebrow>
      <Title>Privacy Policy</Title>
      <Meta>Effective date: 10 May 2026 &nbsp;·&nbsp; BloomVest Finance</Meta>
      <Divider />

      <H2>1. Who we are</H2>
      <P>
        BloomVest Finance ("BloomVest", "we", "us") operates the bloomvest.co platform, an educational
        investment intelligence tool. This policy explains what data we collect, how we use it, and the
        choices you have.
      </P>

      <H2>2. Data we collect</H2>
      <UL>
        <li><strong>Account data</strong> — email address and display name when you sign in via Google OAuth.</li>
        <li><strong>Usage data</strong> — pages visited, features used, and session length, collected anonymously for product improvement.</li>
        <li><strong>Session state</strong> — chat history, journal notes, and learning progress tied to your session or account.</li>
        <li><strong>Technical data</strong> — browser type, device type, and IP address for security and diagnostics.</li>
      </UL>

      <H2>3. How we use your data</H2>
      <UL>
        <li>Delivering the platform and personalising your experience (e.g. saving progress).</li>
        <li>Improving and debugging the service through aggregated analytics.</li>
        <li>Communicating service updates if you have opted in.</li>
        <li>Preventing abuse and ensuring platform security.</li>
      </UL>
      <P>We do not sell your data to third parties or use it for targeted advertising.</P>

      <H2>4. AI features and third-party APIs</H2>
      <P>
        BloomVest Intelligence uses AI models via a third-party API provider. Queries you submit may be
        processed by that provider subject to their data-handling policies. We do not share personally
        identifiable information with the AI provider beyond what is necessary to process your request.
      </P>

      <H2>5. Cookies and local storage</H2>
      <P>
        We use browser local storage to retain session preferences and notes client-side. No third-party
        advertising cookies are set. Authentication uses secure HTTP-only cookies scoped to your session.
      </P>

      <H2>6. Data retention</H2>
      <P>
        Account data is retained while your account is active. You can request deletion at any time by
        contacting us. Anonymised analytics data may be retained for up to 24 months.
      </P>

      <H2>7. Your rights</H2>
      <P>
        Depending on your jurisdiction you may have the right to access, correct, export, or delete your
        personal data. To exercise any of these rights, contact us at the address below.
      </P>

      <H2>8. Security</H2>
      <P>
        We use industry-standard encryption in transit (TLS) and at rest. Access to user data is
        restricted to authorised personnel only. No system is perfectly secure; please use a strong
        password and keep your account credentials private.
      </P>

      <H2>9. Children</H2>
      <P>
        BloomVest is not directed at children under 16. We do not knowingly collect data from anyone
        under 16. If you believe we have done so in error, contact us and we will delete it promptly.
      </P>

      <H2>10. Changes to this policy</H2>
      <P>
        We may update this policy from time to time. Material changes will be signalled by updating the
        effective date above. Continued use of the platform after changes constitutes acceptance.
      </P>

      <ContactBox>
        <strong>Questions?</strong> Contact us at{' '}
        <a href="mailto:hello@bloomvest.co">hello@bloomvest.co</a>. We aim to respond within 5 business days.
      </ContactBox>
    </Shell>
  </Page>
);

export default PrivacyPage;
