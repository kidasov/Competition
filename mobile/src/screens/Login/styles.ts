import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  keyboardContainer: {
    flex: 1
  },

  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  logo: {
    fontSize: 17,
    lineHeight: 24,
    letterSpacing: 1
  },

  form: {
    marginTop: 64
  },

  formContent: {
    justifyContent: "center",
    alignItems: "center"
  },

  scroll: {
    flex: 1,
    flexGrow: 1
  },

  inputContainer: {
    width: 248,
    marginBottom: 30
  },

  input: {
    fontSize: 12,
    fontFamily: "Roboto"
  },

  button: {
    marginTop: 16,
    width: 230,
  }
});

export default styles;