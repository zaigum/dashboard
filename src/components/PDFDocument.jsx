import React from "react";
import { Document, Page, Text, View, StyleSheet, Image } from "@react-pdf/renderer";

const styles = StyleSheet.create({
    page: {
      flexDirection: "column",
      backgroundColor: "white", // Set background color to white
      padding: 10,
    },
    section: {
      margin: 10,
      padding: 10,
      flexGrow: 1,
    },
    title: {
      fontSize: 24,
      fontWeight: "bold",
      marginBottom: 10,
    },
    content: {
      fontSize: 12,
      lineHeight: 1.5,
      marginBottom: 10,
    },
    image: {
      width: 200,
      height: 200,
      marginBottom: 10,
    },
  });
  

const PDFDocument = ({ title, content, imageData }) => {
  // Function to strip HTML tags from content
  const stripHtmlTags = (html) => {
    const doc = new DOMParser().parseFromString(html, "text/html");
    return doc.body.textContent || "";
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          <Text style={styles.title}>{title}</Text>
          {imageData && <Image src={imageData} style={styles.image} />}
          <Text style={styles.content}>{stripHtmlTags(content)}</Text>
        </View>
      </Page>
    </Document>
  );
};

export default PDFDocument;
