import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { ActivityIndicator, Button, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { GEMINI_API } from "@env";

interface GeneratedResult {
  input: String,
  result: String
}

export default function HomeScreen() {

  const [result, setResult] = useState("")
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [finalResult, setFinalResult] = useState<GeneratedResult[]>([])
  const scrollViewRef = useRef<ScrollView>(null);

  // let apikey = process.env.EXPO_GEMINI_API

  async function geminigenerator() {

    try {
      setLoading(true)

      const response = await axios({
        url: `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${GEMINI_API}`,
        method: "post",
        data: {
          contents: [{ parts: [{ text: input }] }]
        }
      })

      let generatedResult = response.data.candidates[0].content.parts[0].text

      setResult(generatedResult)
      setInput("")

      let obj = {
        input,
        result: generatedResult
      }

      setFinalResult([...finalResult, obj])
    } catch (error) {
      console.error("Error generating content:", error);
      setResult("An error occurred while generating content.");
    } finally {
      setLoading(false);
    }
  }
 useEffect(() => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: true }); // Scroll to end smoothly
    }
  }, [finalResult]);


  return (
    <>
      <ScrollView contentContainerStyle={styles.mainContainer}>
        {/* <View style={styles.header}>
          <Text style={styles.title}>Erfan's Chatbot</Text>
        </View> */}

        <ScrollView style={styles.resultContainer} ref={scrollViewRef}>
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#4B5563" />
              <Text style={styles.loadingText}>Please wait, generating content....</Text>
            </View>
          ) : (
            <>
              {finalResult.map((data, index) => (
                <View key={index} style={styles.resultBox}>
                  <Text style={styles.question}>{data.input}</Text>
                  <Text style={styles.answer}>{data.result}</Text>
                </View>
              ))}
            </>
          )}
        </ScrollView>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={input}
            placeholder="Enter your question"
            placeholderTextColor="#9CA3AF"
            onChangeText={(value) => setInput(value)}
          />
          <Button title="Generate Content" color="#2563EB" onPress={geminigenerator} />
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "#F3F4F6",
    padding: 20,
  },
  header: {
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#1F2937",
    textAlign: "center",
  },
  resultContainer: {
    flex: 1,
    padding: 10,
  },
  loadingContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 20,
  },
  loadingText: {
    fontSize: 16,
    color: "#4B5563",
    marginTop: 10,
  },
  resultBox: {
    backgroundColor: "#E5E7EB",
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#D1D5DB",
  },
  question: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 8,
  },
  answer: {
    fontSize: 16,
    color: "#374151",
  },
  inputContainer: {
    flexDirection: "column",
    gap: 10,
    marginTop: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#9CA3AF",
    borderRadius: 10,
    padding: 10,
    fontSize: 16,
    backgroundColor: "#FFFFFF",
    color: "#111827",
  },
});