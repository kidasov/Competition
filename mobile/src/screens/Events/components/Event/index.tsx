import React from 'react';
import { Text } from 'react-native';
import { Card, Button } from 'react-native-elements';

import { API_HOST } from 'api';

import styles from './styles';

const Event = ({ event }) => {
  const { name, coverMediaId } = event;
  return (
    <Card title={name} image={{ uri: `${API_HOST}/storage/${coverMediaId}` }}>
      <Text style={styles.text}>
        The idea with React Native Elements is more about component structure
        than actual design.
      </Text>
      <Button buttonStyle={styles.button} title="Открыть" />
    </Card>
  );
};

export default Event;
