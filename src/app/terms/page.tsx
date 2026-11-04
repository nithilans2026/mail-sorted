import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Service · MAIL SORTED",
  description: "Terms of service for MAIL SORTED.",
};

export default function TermsPage() {
  return (
    <main className="landing" style={{ padding: "40px 24px", maxWidth: "800px", margin: "0 auto" }}>
      <header style={{ marginBottom: "32px" }}>
        <Link href="/" style={{ fontWeight: 700, fontSize: "18px", color: "var(--blue)" }}>
          ← Back to MAIL SORTED
        </Link>
        <h1 style={{ fontSize: "36px", fontWeight: 800, marginTop: "16px", marginBottom: "8px" }}>Terms of Service</h1>
        <p className="muted small">Last updated: November 2026</p>
      </header>

      <section style={{ display: "flex", flexDirection: "column", gap: "20px", lineHeight: "1.6" }}>
        <div>
          <h2 style={{ fontSize: "20px", fontWeight: 700, marginBottom: "8px" }}>1. Acceptance of Terms</h2>
          <p>
            By accessing or using MAIL SORTED (the &quot;Service&quot;), you agree to be bound by these Terms of Service.
            If you do not agree to these terms, do not use the Service.
          </p>
        </div>

        <div>
          <h2 style={{ fontSize: "20px", fontWeight: 700, marginBottom: "8px" }}>2. Description of Service</h2>
          <p>
            MAIL SORTED is a student productivity tool designed to categorize and organize university emails, display
            deadlines, provide multilingual email views, and allow sending emails via connected Google accounts.
          </p>
        </div>

        <div>
          <h2 style={{ fontSize: "20px", fontWeight: 700, marginBottom: "8px" }}>3. User Responsibilities</h2>
          <p>
            You are responsible for safeguarding access to your Google account and for all activities that occur under your session.
            You agree not to use the Service for spamming, sending malicious communications, or violating Google&apos;s Acceptable Use Policies.
          </p>
        </div>

        <div>
          <h2 style={{ fontSize: "20px", fontWeight: 700, marginBottom: "8px" }}>4. Disclaimer of Warranty & Limitation of Liability</h2>
          <p>
            The Service is provided on an &quot;AS IS&quot; and &quot;AS AVAILABLE&quot; basis without warranties of any kind.
            The developer does not guarantee that email categorization or automated deadline extraction will be error-free.
          </p>
        </div>

        <div>
          <h2 style={{ fontSize: "20px", fontWeight: 700, marginBottom: "8px" }}>5. Contact</h2>
          <p>
            For any questions regarding these Terms, contact:{" "}
            <a href="mailto:nithilan.s2026@vitstudent.ac.in" style={{ color: "var(--blue)" }}>
              nithilan.s2026@vitstudent.ac.in
            </a>.
          </p>
        </div>
      </section>
    </main>
  );
}
