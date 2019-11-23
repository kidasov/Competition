import React from 'react';
import {
  Text,
  View,
  KeyboardAvoidingView,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import {Form, Field} from 'react-final-form';
import {Input, Icon, Button} from 'react-native-elements';
import styles from './styles';


const Login = () => {
  const login = () => { console.warn("log in here") };

  const renderForm = ({ handleSubmit, form, submitting, pristine, values }) => {
    return (
      <View style={styles.formContent}>
        <Field name="username">
          {({input, meta}) => (
            <Input
              containerStyle={styles.inputContainer}
              inputStyle={styles.input}
              placeholder="Электронная почта"
              leftIcon={<Icon name="mail" size={24} color="black" />}
            />
          )}
        </Field>
        <Field name="password">
          {({input, meta}) => (
            <Input
              containerStyle={styles.inputContainer}
              inputStyle={styles.input}
              placeholder="Пароль"
              leftIcon={<Icon name="lock" size={24} color="black" />}
            />
          )}
        </Field>
        <Button containerStyle={styles.button} onPress={handleSubmit} title="Войти" />
      </View>
    )
  };

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView behavior="padding" style={styles.keyboardContainer}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.content}>
          <View>
            <Text style={styles.logo}>Настольный теннис</Text>
          </View>
          <View style={styles.form}>
            <Form
              onSubmit={login}
              render={renderForm}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

export default Login;
