import { useState } from "react";

export default function FAQSection() {
  const faqs = [
    {
      q: "Are the study notes on UniNotes completely free?",
      a: "Yes. Every single document shared by our student community is 100% free to browse, preview inline, and download in PDF format. There are no hidden subscription tiers."
    },
    {
      q: "How does note verification work?",
      a: "Our community team reviews every upload to ensure legibility, syllabus alignment, and unit organization. Notes containing spam, copyrighted textbooks, or illegible scans are rejected."
    },
    {
      q: "Can I upload my own handwritten notes?",
      a: "Absolutely. Most of our high-scoring documents are handwritten notes. As long as your writing is clean, well-lit, and structured by units or syllabus chapters, we highly encourage sharing them."
    },
    {
      q: "How do I unlock the Contributor Rank?",
      a: "Upload at least 5 verified study documents to earn your official Contributor badge. This displays a terracotta star next to your initials and features your profile in our top contributors widgets."
    },
    {
      q: "What engineering departments are supported?",
      a: "We currently offer dedicated filtering for Computer Science (CSE), Information Technology (IT), Mechanical (ME), Electronics (ECE), Electrical (EE), and Civil Engineering (CE) core syllabi."
    },
    {
      q: "How can I edit or remove my uploaded notes?",
      a: "You have full control over your uploads. Simply navigate to your private dashboard to edit titles, update university metadata, or permanently delete documents at any time."
    }
  ];

  return (
    <div className="container" style={{ marginTop: "4rem", marginBottom: "4rem" }}>
      {/* FAQ Title */}
      <div style={{ textAlign: "left", marginBottom: "3rem" }}>
        <p style={{
          fontSize: "0.72rem",
          fontWeight: 700,
          color: "var(--text-muted)",
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          marginBottom: "0.6rem"
        }}>
          QUESTIONS & ANSWERS
        </p>
        <h2 style={{
          fontSize: "clamp(1.8rem, 3.5vw, 2.2rem)",
          fontWeight: 800,
          margin: 0,
          color: "var(--text)",
          letterSpacing: "-0.5px"
        }}>
          Got questions? We've got answers.
        </h2>
      </div>

      {/* Grid Layout */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
        gap: "2rem"
      }}>
        {faqs.map((faq, i) => (
          <div
            key={i}
            style={{
              padding: "1.75rem",
              background: "var(--bg-card)",
              border: "1px solid var(--border)",
              borderRadius: "0px",
              display: "flex",
              flexDirection: "column",
              gap: "0.75rem"
            }}
          >
            {/* Number Indicator */}
            <div style={{
              fontSize: "0.68rem",
              fontWeight: 800,
              color: "var(--primary)",
              letterSpacing: "0.1em",
              textTransform: "uppercase"
            }}>
              Question {(i + 1).toString().padStart(2, "0")}
            </div>

            {/* Question */}
            <h3 style={{
              fontSize: "1.02rem",
              fontWeight: 750,
              color: "var(--text)",
              margin: 0,
              lineHeight: 1.35
            }}>
              {faq.q}
            </h3>

            {/* Answer */}
            <p style={{
              color: "var(--text-muted)",
              fontSize: "0.85rem",
              lineHeight: 1.6,
              margin: 0
            }}>
              {faq.a}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
