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

const DisclaimerBox = styled.div`
  margin: 2rem 0;
  padding: 1.25rem 1.35rem;
  background: #fffbeb;
  border: 1px solid #fde68a;
  border-radius: 12px;
  font-size: 0.85rem;
  color: #78350f;
  line-height: 1.65;
  font-weight: 500;
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

const TermsPage = () => (
  <Page>
    <Shell>
      <Eyebrow>Legal</Eyebrow>
      <Title>Terms of Service</Title>
      <Meta>Effective date: 10 May 2026 &nbsp;·&nbsp; BloomVest Finance</Meta>
      <Divider />

      <DisclaimerBox>
        <strong>Educational use only.</strong> Nothing on BloomVest constitutes personalised financial
        advice, a solicitation, or a recommendation to buy or sell any security. All content is for
        informational and educational purposes. Always consult a licensed financial professional before
        making investment decisions.
      </DisclaimerBox>

      <H2>1. Acceptance of terms</H2>
      <P>
        By accessing or using BloomVest Finance ("the Service") you agree to be bound by these Terms of
        Service and our Privacy Policy. If you do not agree, do not use the Service.
      </P>

      <H2>2. Description of service</H2>
      <P>
        BloomVest is an educational investment intelligence platform. It provides AI-assisted market
        commentary, learning modules, scenario simulators, and a personal journal — all for educational
        purposes only.
      </P>

      <H2>3. Eligibility</H2>
      <P>
        You must be at least 16 years old to use the Service. By using it you confirm that you meet this
        requirement.
      </P>

      <H2>4. No financial advice</H2>
      <P>
        All signals, AI picks, market commentary, and educational content produced by BloomVest are
        generated from publicly available information and AI models. They are <strong>not</strong>{' '}
        personalised financial advice and do not take into account your individual circumstances, risk
        tolerance, or financial goals. Past performance data shown is illustrative only.
      </P>

      <H2>5. Acceptable use</H2>
      <P>You agree not to:</P>
      <UL>
        <li>Use the Service for any unlawful purpose.</li>
        <li>Scrape, copy, or redistribute content without permission.</li>
        <li>Attempt to reverse-engineer or interfere with the platform's infrastructure.</li>
        <li>Impersonate any person or entity.</li>
        <li>Use the Service to generate, distribute, or act on financial advice to third parties.</li>
      </UL>

      <H2>6. Intellectual property</H2>
      <P>
        All platform content, branding, and code remain the property of BloomVest Finance. User-generated
        content (e.g. journal notes) belongs to you; you grant us a limited licence to store and
        display it within the Service.
      </P>

      <H2>7. Third-party data and AI</H2>
      <P>
        The Service aggregates publicly available news and uses third-party AI APIs. We do not guarantee
        the accuracy, completeness, or timeliness of any data or AI-generated content. Market data
        displayed is not real-time and should not be relied upon for trading decisions.
      </P>

      <H2>8. Disclaimers and limitation of liability</H2>
      <P>
        The Service is provided "as is" without warranties of any kind. To the maximum extent permitted
        by law, BloomVest shall not be liable for any direct, indirect, incidental, or consequential
        damages arising from your use of, or inability to use, the Service — including any trading or
        investment losses.
      </P>

      <H2>9. Termination</H2>
      <P>
        We reserve the right to suspend or terminate your access at any time for breach of these Terms.
        You may stop using the Service at any time; contact us to request account deletion.
      </P>

      <H2>10. Governing law</H2>
      <P>
        These Terms are governed by the laws of England and Wales. Any disputes will be subject to the
        exclusive jurisdiction of the courts of England and Wales.
      </P>

      <H2>11. Changes to these terms</H2>
      <P>
        We may update these Terms at any time. Continued use after changes are posted constitutes
        acceptance. Material changes will be flagged by updating the effective date above.
      </P>

      <ContactBox>
        <strong>Questions?</strong> Contact us at{' '}
        <a href="mailto:hello@bloomvest.co">hello@bloomvest.co</a>.
      </ContactBox>
    </Shell>
  </Page>
);

export default TermsPage;
