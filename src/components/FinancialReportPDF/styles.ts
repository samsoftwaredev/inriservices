import { StyleSheet, Font } from "@react-pdf/renderer";

export const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 10,
    fontFamily: "Helvetica",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    paddingBottom: 10,
    borderBottom: "2pt solid #333",
  },
  headerText: {
    fontSize: 10,
    color: "#333",
  },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 40,
    right: 40,
    textAlign: "center",
    fontSize: 8,
    color: "#666",
  },
  coverPage: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  coverTitle: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#1a1a1a",
  },
  coverSubtitle: {
    fontSize: 16,
    marginBottom: 10,
    color: "#333",
  },
  coverInfo: {
    marginTop: 40,
    width: "100%",
    maxWidth: 400,
  },
  coverInfoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
    paddingBottom: 8,
    borderBottom: "1pt solid #ddd",
  },
  coverLabel: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#555",
  },
  coverValue: {
    fontSize: 11,
    color: "#1a1a1a",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 15,
    marginTop: 10,
    color: "#1a1a1a",
    borderBottom: "2pt solid #1a1a1a",
    paddingBottom: 5,
  },
  summaryGrid: {
    marginBottom: 20,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderBottom: "1pt solid #eee",
  },
  summaryRowHighlight: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    paddingHorizontal: 10,
    backgroundColor: "#f5f5f5",
    fontWeight: "bold",
    borderTop: "2pt solid #333",
    borderBottom: "2pt solid #333",
    marginTop: 5,
  },
  summaryLabel: {
    fontSize: 11,
    color: "#333",
  },
  summaryValue: {
    fontSize: 11,
    color: "#1a1a1a",
    fontWeight: "bold",
  },
  table: {
    width: "100%",
    marginBottom: 20,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#333",
    color: "#fff",
    paddingVertical: 8,
    paddingHorizontal: 5,
    fontWeight: "bold",
    fontSize: 9,
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 6,
    paddingHorizontal: 5,
    borderBottom: "1pt solid #eee",
    fontSize: 9,
  },
  tableRowAlt: {
    flexDirection: "row",
    paddingVertical: 6,
    paddingHorizontal: 5,
    borderBottom: "1pt solid #eee",
    backgroundColor: "#f9f9f9",
    fontSize: 9,
  },
  tableCell: {
    flex: 1,
    paddingHorizontal: 3,
  },
  tableCellSmall: {
    width: "8%",
    paddingHorizontal: 2,
  },
  tableCellMedium: {
    width: "12%",
    paddingHorizontal: 2,
  },
  tableCellLarge: {
    width: "15%",
    paddingHorizontal: 2,
  },
  textRight: {
    textAlign: "right",
  },
  textCenter: {
    textAlign: "center",
  },
  alert: {
    backgroundColor: "#fff3cd",
    border: "1pt solid #ffc107",
    padding: 10,
    marginBottom: 15,
    borderRadius: 4,
  },
  alertText: {
    fontSize: 10,
    color: "#856404",
  },
  infoBox: {
    backgroundColor: "#f8f9fa",
    border: "1pt solid #dee2e6",
    padding: 12,
    marginBottom: 15,
    borderRadius: 4,
  },
  infoText: {
    fontSize: 9,
    color: "#495057",
    lineHeight: 1.5,
  },
  categoryBreakdown: {
    marginBottom: 15,
  },
  categoryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 5,
    paddingHorizontal: 8,
    borderBottom: "1pt solid #eee",
  },
  categoryName: {
    fontSize: 10,
    flex: 2,
  },
  categoryValue: {
    fontSize: 10,
    flex: 1,
    textAlign: "right",
    fontWeight: "bold",
  },
  categoryCount: {
    fontSize: 9,
    flex: 1,
    textAlign: "center",
    color: "#666",
  },
  categoryPercent: {
    fontSize: 9,
    flex: 1,
    textAlign: "right",
    color: "#666",
  },
  notesSection: {
    marginTop: 20,
    padding: 15,
    border: "1pt solid #ddd",
    minHeight: 100,
  },
  notesTitle: {
    fontSize: 12,
    fontWeight: "bold",
    marginBottom: 10,
  },
  notesLine: {
    borderBottom: "1pt solid #ddd",
    marginBottom: 15,
    paddingBottom: 10,
  },
  definitions: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "#f8f9fa",
  },
  definitionsTitle: {
    fontSize: 11,
    fontWeight: "bold",
    marginBottom: 8,
  },
  definitionItem: {
    marginBottom: 5,
    fontSize: 9,
    lineHeight: 1.4,
  },
  definitionTerm: {
    fontWeight: "bold",
  },
});
