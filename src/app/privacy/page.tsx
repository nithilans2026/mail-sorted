import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy · MAIL SORTED",
  description: "Privacy policy for MAIL SORTED.",
};

export default function PrivacyPage() {
  return (
    <main className="landing" style={{ padding: "40px 24px", maxWidth: "800px", margin: "0 auto" }}>
      <header style={{ marginBottom: "32px" }}>
        <Link href="/" style={{ fontWeight: 700, fontSize: "18px", color: "var(--blue)" }}>
          ← Back to MAIL SORTED
        </Link>
        <h1 style={{ fontSize: "36px", fontWeight: 800, marginTop: "16px", marginBottom: "8px" }}>Privacy Policy</h1>
        <p className="muted small">Last updated: November 2026</p>
      </header>

      <section style={{ display: "flex", flexDirection: "column", gap: "20px", lineHeight: "1.6" }}>
        <div>
          <h2 style={{ fontSize: "20px", fontWeight: 700, marginBottom: "8px" }}>1. Overview</h2>
          <p>
            MAIL SORTED is an educational student inbox management web application created to help university students
            organize campus communications (transport schedules, exam timetables, assignment deadlines, and campus events).
          </p>
        </div>

        <div>
          <h2 style={{ fontSize: "20px", fontWeight: 700, marginBottom: "8px" }}>2. Google User Data & Permissions</h2>
          <p>
            When you sign in using Google OAuth, our application requests access to the following Gmail scopes:
          </p>
          <ul style={{ paddingLeft: "24px", marginTop: "8px" }}>
            <li><code>gmail.modify</code>: To read incoming student notices and allow you to move unwanted messages to Trash when you explicitly choose to.</li>
            <li><code>gmail.send</code>: To allow you to compose and send emails directly from within the app interface.</li>
          </ul>
          <p style={{ marginTop: "8px" }}>
            <strong>We never see, record, or store your Google password.</strong>
          </p>
        </div>

        <div>
          <h2 style={{ fontSize: "20px", fontWeight: 700, marginBottom: "8px" }}>3. Data Storage & Retention</h2>
          <p>
            MAIL SORTED does not maintain any persistent external database of your emails. All email parsing and sorting occurs
            in-memory per session. User preferences (such as selected language, sound settings, layout orientation, and blocked
            senders) are stored solely on your own device in your browser&apos;s local storage (<code>localStorage</code>).
          </p>
        </div>

        <div>
          <h2 style={{ fontSize: "20px", fontWeight: 700, marginBottom: "8px" }}>4. Third-Party Services</h2>
          <p>
            We do not sell, rent, or transfer your personal data or email contents to third parties or data brokers.
            When translation is requested, email text is securely processed via translation APIs solely to provide the translated view.
          </p>
        </div>

        <div>
          <h2 style={{ fontSize: "20px", fontWeight: 700, marginBottom: "8px" }}>5. Contact & Inquiries</h2>
          <p>
            If you have questions about this policy or the application, you can reach the developer at:{" "}
            <a href="mailto:nithilan.s2026@vitstudent.ac.in" style={{ color: "var(--blue)" }}>
              nithilan.s2026@vitstudent.ac.in
            </a>.
          </p>
        </div>
      </section>
    </main>
  );
}
