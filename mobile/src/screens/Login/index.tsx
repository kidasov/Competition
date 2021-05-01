import React from 'react';
import { Text, View, KeyboardAvoidingView } from 'react-native';
import { Form, Field } from 'react-final-form';
import { Input, Icon, Button } from 'react-native-elements';
import { observer } from 'mobx-react-lite';
import { observable } from 'mobx';
import styles from './styles';

import * as ERRORS from 'constants/errors';
import * as Routes from 'constants/routes';
import PopupMessage from 'components/PopupMessage';

import { useStores } from 'store';

const error = observable.box('');

const handleCloseError = () => {
  error.set('');
};

const Login = observer(props => {
  const { authStore, eventStore } = useStores();

  const login = async ({ email, password }) => {
    const { navigation } = props;
    try {
      await authStore.signIn({ email, password });

      if (authStore.isAuthorized) {
        navigation.navigate(Routes.EVENTS);
      }
    } catch (e) {
      if (e.status === ERRORS.UNAUTHORIZED) {
        error.set('Invalid username or password');
      }
    }
  };

  const renderForm = ({ handleSubmit, form, submitting, pristine, values }) => {
    return (
      <View style={styles.formContent}>
        <Field name="email">
          {({ input, meta }) => {
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
          {({ input, meta }) => (
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
      {!!error.get() && (
        <View style={styles.error}>
          <PopupMessage text={error.get()} onClose={handleCloseError} />
        </View>
      )}
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
});

export default Login;
