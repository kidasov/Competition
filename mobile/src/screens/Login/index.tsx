import React, {Component} from 'react';
import {Text, View, KeyboardAvoidingView, ScrollView} from 'react-native';
import {Form, FormRenderProps, Field} from 'react-final-form';
import {Input, Icon, Button} from 'react-native-elements';
import styles from './styles';

class Login extends Component {
  login() {}

  renderForm(props: FormRenderProps) {
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
        <Button containerStyle={styles.button} title="Войти" />
      </View>
    );
  }

  render() {
    return (
      <View style={styles.container}>
        <KeyboardAvoidingView
          behavior="padding"
          style={styles.keyboardContainer}>
          <ScrollView
            style={styles.scroll}
            contentContainerStyle={styles.content}>
            <View>
              <Text style={styles.logo}>Настольный теннис</Text>
            </View>
            <View style={styles.form}>
              <Form render={this.renderForm} onSubmit={this.login} />
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    );
  }
}

export default Login;
