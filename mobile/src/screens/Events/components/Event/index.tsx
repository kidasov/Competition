import React from 'react';
import { Text } from 'react-native';
import { Card, Button } from 'react-native-elements';

import { API_HOST } from 'api';

import styles from './styles';

const Event = ({ event }) => {
  const { name, coverMediaId } = event;
  const image = coverMediaId
    ? { uri: `${API_HOST}/storage/${coverMediaId}` }
    : require('assets/images/timo.jpg');
  return (
    <Card
      containerStyle={styles.card}
      title={name}
      titleStyle={styles.title}
      image={image}>
      <Text style={styles.text}>
        Шла Александра по автомагистрали и употребляла хлебобулочное изделие.
      </Text>
      <Button
        buttonStyle={styles.button}
        titleStyle={styles.buttonTitle}
        title="Открыть"
      />
    </Card>
  );
};

export default Event;
