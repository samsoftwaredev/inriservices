import React from "react";

const PromoBadge = () => {
  return (
    <div style={styles.badge}>
      <span style={styles.text}>Free, no-obligations quotes — let’s talk</span>
    </div>
  );
};

const styles = {
  badge: {
    backgroundColor: "#e53935",
    borderRadius: "50%",
    width: 200,
    height: 200,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    textAlign: "center" as const,
    boxShadow: "0 0 20px rgba(0,0,0,0.2)",
  },
  text: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
    lineHeight: 1.2,
  },
};

export default PromoBadge;
