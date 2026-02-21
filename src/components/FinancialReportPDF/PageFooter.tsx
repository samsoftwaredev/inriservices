import React from "react";
import { View, Text } from "@react-pdf/renderer";
import { styles } from "./styles";

interface PageFooterProps {
  pageNumber: number;
  totalPages: number;
}

export const PageFooter: React.FC<PageFooterProps> = ({
  pageNumber,
  totalPages,
}) => {
  return (
    <View style={styles.footer} fixed>
      <Text>
        Page {pageNumber} of {totalPages}
      </Text>
    </View>
  );
};
