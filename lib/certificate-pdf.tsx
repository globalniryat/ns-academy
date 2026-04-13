/**
 * Certificate PDF template — server-side only.
 * Import ONLY in Route Handlers or Server Actions, never in client components.
 */
import React from "react";
import { Document, Page, View, Text, StyleSheet } from "@react-pdf/renderer";

export interface CertificateData {
  studentName: string;
  courseTitle: string;
  certificateNo: string;
  issuedAt: Date;
  instructorName?: string;
}

const FOREST   = "#14532d";
const GREEN    = "#166534";
const GOLD     = "#ca8a04";
const GOLD_LT  = "#d4a017";
const OFFWHITE = "#fdf8f0";
const MUTED    = "#6b7280";
const LIGHT_G  = "#86efac";

const styles = StyleSheet.create({
  page: {
    backgroundColor: OFFWHITE,
    fontFamily: "Helvetica",
    padding: 28,
  },

  /* ── Double border frame ───────────────────────── */
  outerFrame: {
    flex: 1,
    borderWidth: 4,
    borderColor: GOLD,
    padding: 7,
    flexDirection: "column",
  },
  innerFrame: {
    flex: 1,
    borderWidth: 1,
    borderColor: GREEN,
    flexDirection: "column",
    backgroundColor: "#ffffff",
  },

  /* ── Header band ───────────────────────────────── */
  header: {
    backgroundColor: FOREST,
    paddingVertical: 20,
    paddingHorizontal: 50,
    alignItems: "center",
    position: "relative",
  },
  /* corner L-brackets */
  cTL: {
    position: "absolute", top: 10, left: 14,
    width: 26, height: 26,
    borderTopWidth: 2, borderLeftWidth: 2, borderColor: GOLD,
  },
  cTR: {
    position: "absolute", top: 10, right: 14,
    width: 26, height: 26,
    borderTopWidth: 2, borderRightWidth: 2, borderColor: GOLD,
  },
  cBL: {
    position: "absolute", bottom: 10, left: 14,
    width: 26, height: 26,
    borderBottomWidth: 2, borderLeftWidth: 2, borderColor: GOLD,
  },
  cBR: {
    position: "absolute", bottom: 10, right: 14,
    width: 26, height: 26,
    borderBottomWidth: 2, borderRightWidth: 2, borderColor: GOLD,
  },
  headerDot: {
    width: 5, height: 5, borderRadius: 3,
    backgroundColor: GOLD, marginBottom: 10,
  },
  headerName: {
    fontSize: 18, letterSpacing: 6,
    color: "#ffffff", fontFamily: "Helvetica-Bold",
    textTransform: "uppercase", marginBottom: 5,
  },
  headerTagline: {
    fontSize: 7.5, color: LIGHT_G,
    letterSpacing: 2.5, textTransform: "uppercase",
  },

  /* ── Gold rule below header ────────────────────── */
  goldRule: { height: 3, backgroundColor: GOLD_LT },
  thinRule:  { height: 1, backgroundColor: "#d1fae5" },

  /* ── Body ──────────────────────────────────────── */
  body: {
    flex: 1, alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 60, paddingVertical: 20,
  },
  certTitle: {
    fontSize: 34, fontFamily: "Helvetica-Bold",
    color: FOREST, letterSpacing: 1, marginBottom: 4,
  },
  presentsLabel: {
    fontSize: 8, color: MUTED,
    letterSpacing: 3, textTransform: "uppercase",
    marginBottom: 20,
  },

  /* Student name block */
  nameBlock: { alignItems: "center", marginBottom: 20 },
  studentName: {
    fontSize: 42, fontFamily: "Helvetica-BoldOblique",
    color: FOREST, letterSpacing: 0.5,
  },
  nameUnderline: {
    height: 2, width: 320, backgroundColor: GOLD_LT,
    marginTop: 7,
  },

  courseLabel: {
    fontSize: 8, color: MUTED, letterSpacing: 2.5,
    textTransform: "uppercase", marginBottom: 6,
  },
  courseTitle: {
    fontSize: 17, fontFamily: "Helvetica-Bold",
    color: GREEN, textAlign: "center", marginBottom: 28,
  },

  /* Ornamental divider */
  dividerRow: {
    flexDirection: "row", alignItems: "center",
    marginBottom: 28, width: 340,
  },
  dividerLine: { flex: 1, height: 1, backgroundColor: "#bbf7d0" },
  dividerCircle: {
    width: 9, height: 9, borderRadius: 5,
    borderWidth: 2, borderColor: GOLD,
    marginHorizontal: 8,
  },

  /* ── Footer row ────────────────────────────────── */
  footerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    paddingHorizontal: 30,
  },
  footerItem: { alignItems: "center", minWidth: 140 },
  footerValue: {
    fontSize: 11, fontFamily: "Helvetica-Bold",
    color: "#1f2937", marginBottom: 5,
  },
  footerLine: {
    width: 140, height: 1,
    backgroundColor: "#d1d5db", marginBottom: 4,
  },
  footerLabel: {
    fontSize: 7, color: MUTED,
    textTransform: "uppercase", letterSpacing: 1.5,
  },

  /* Centre seal */
  seal: {
    width: 68, height: 68, borderRadius: 34,
    backgroundColor: FOREST,
    borderWidth: 2, borderColor: GOLD_LT,
    alignItems: "center", justifyContent: "center",
    marginBottom: 4,
  },
  sealInitials: {
    fontSize: 18, fontFamily: "Helvetica-Bold",
    color: "#ffffff", letterSpacing: 1,
    marginBottom: 2,
  },
  sealSubText: {
    fontSize: 4.5, color: LIGHT_G,
    letterSpacing: 1.2, textTransform: "uppercase",
  },

  /* ── Bottom strip ──────────────────────────────── */
  bottomStrip: {
    backgroundColor: "#f9fafb",
    borderTopWidth: 1, borderColor: "#e5e7eb",
    paddingVertical: 7, paddingHorizontal: 18,
    flexDirection: "row",
    justifyContent: "space-between", alignItems: "center",
  },
  stripText: {
    fontSize: 7, color: "#9ca3af", letterSpacing: 0.5,
  },
});

export function CertificatePDFDocument({
  studentName,
  courseTitle,
  certificateNo,
  issuedAt,
  instructorName = "CA Nikesh Shah",
}: CertificateData) {
  const dateStr = issuedAt.toLocaleDateString("en-IN", {
    day: "numeric", month: "long", year: "numeric",
  });

  return (
    <Document
      title={`Certificate of Completion — ${courseTitle}`}
      author="NS Academy"
      subject={`Certificate for ${studentName}`}
    >
      <Page size="A4" orientation="landscape" style={styles.page}>
        <View style={styles.outerFrame}>
          <View style={styles.innerFrame}>

            {/* ── Header ── */}
            <View style={styles.header}>
              <View style={styles.cTL} /><View style={styles.cTR} />
              <View style={styles.cBL} /><View style={styles.cBR} />
              <View style={styles.headerDot} />
              <Text style={styles.headerName}>NS  Academy</Text>
              <Text style={styles.headerTagline}>Powered by CA Nikesh Shah</Text>
            </View>

            <View style={styles.goldRule} />
            <View style={styles.thinRule} />

            {/* ── Body ── */}
            <View style={styles.body}>
              <Text style={styles.certTitle}>Certificate of Completion</Text>
              <Text style={styles.presentsLabel}>is proudly presented to</Text>

              {/* Student name */}
              <View style={styles.nameBlock}>
                <Text style={styles.studentName}>{studentName}</Text>
                <View style={styles.nameUnderline} />
              </View>

              <Text style={styles.courseLabel}>For successfully completing</Text>
              <Text style={styles.courseTitle}>{courseTitle}</Text>

              {/* Ornament */}
              <View style={styles.dividerRow}>
                <View style={styles.dividerLine} />
                <View style={styles.dividerCircle} />
                <View style={styles.dividerLine} />
              </View>

              {/* Footer row */}
              <View style={styles.footerRow}>
                <View style={styles.footerItem}>
                  <Text style={styles.footerValue}>{dateStr}</Text>
                  <View style={styles.footerLine} />
                  <Text style={styles.footerLabel}>Date of Issue</Text>
                </View>

                {/* Seal */}
                <View style={{ alignItems: "center" }}>
                  <View style={styles.seal}>
                    <Text style={styles.sealInitials}>NSA</Text>
                    <Text style={styles.sealSubText}>Verified</Text>
                  </View>
                </View>

                <View style={styles.footerItem}>
                  <Text style={styles.footerValue}>{instructorName}</Text>
                  <View style={styles.footerLine} />
                  <Text style={styles.footerLabel}>Instructor</Text>
                </View>
              </View>
            </View>

            {/* ── Bottom strip ── */}
            <View style={styles.bottomStrip}>
              <Text style={styles.stripText}>NS Academy · nsacademy.in</Text>
              <Text style={styles.stripText}>Certificate No: {certificateNo}</Text>
            </View>

          </View>
        </View>
      </Page>
    </Document>
  );
}
