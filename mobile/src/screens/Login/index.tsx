import React from 'react';
import {
  Text,
  View,
  KeyboardAvoidingView
} from 'react-native';
import {Form, Field} from 'react-final-form';
import {Input, Icon, Button} from 'react-native-elements';
import styles from './styles';

import { useStores } from 'store';

const Login = () => {
  const { authStore } = useStores();

  const login = async ({email, password}) => {
    await authStore.signIn({ email, password })
  };

  const renderForm = ({handleSubmit, form, submitting, pristine, values}) => {
    return (
      <View style={styles.formContent}>
        <Field name="email">
          {({input, meta}) => {
            return (
              <Input
                {...input}
                containerStyle={styles.inputContainer}
                inputStyle={styles.input}
                placeholder="Электронная почта"
                leftIcon={<Icon name="mail" size={24} color="black" />}
              />
            );
          }}
        </Field>
        <Field name="password">
          {({input, meta}) => (
            <Input
              {...input}
              containerStyle={styles.inputContainer}
              inputStyle={styles.input}
              placeholder="Пароль"
              leftIcon={<Icon name="lock" size={24} color="black" />}
            />
          )}
        </Field>
        <Button
          containerStyle={styles.button}
          onPress={handleSubmit}
          title="Войти"
        />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView behavior="padding" style={styles.keyboardContainer}>
        <View>
          <Text style={styles.logo}>Настольный теннис</Text>
        </View>
        <View style={styles.form}>
          <Form onSubmit={login} render={renderForm} />
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

export default Login;
