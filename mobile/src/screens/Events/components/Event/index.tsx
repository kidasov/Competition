import React from 'react';
import { Text, View } from 'react-native';
import { Card, Button } from 'react-native-elements';

import { API_HOST } from 'api';
import { Event } from 'types';
import { EventType } from 'types/event';

import styles from './styles';

type Props = {
  event: Event;
};

type RenderEventProps = {
  eventType: EventType;
};

const RenderEventType: React.FunctionComponent<RenderEventProps> = (
  eventType: RenderEventProps,
) => {
  let eventTypeDescription = 'Не установлен';

  if (eventType === EventType.Single) {
    eventTypeDescription = 'Одиночный';
  } else {
    eventTypeDescription = 'Парный';
  }

  return (
    <View style={styles.typeContainer}>
      <Text style={styles.type}>Тип соревнования:</Text>
      <Text style={styles.typeDescription}>{eventTypeDescription}</Text>
    </View>
  );
};

const EventCard: React.FunctionComponent<Props> = (event: Props) => {
  const { name, description, coverMediaId, type } = event.event;
  const image = coverMediaId
    ? { uri: `${API_HOST}/storage/${coverMediaId}` }
    : require('assets/images/timo.jpg');
  return (
    <Card
      containerStyle={styles.card}
      title={name}
      titleStyle={styles.title}
      image={image}>
      {RenderEventType(type)}
      <Text style={styles.text}>{description}</Text>
      <Button
        buttonStyle={styles.button}
        titleStyle={styles.buttonTitle}
        title="Открыть"
      />
    </Card>
  );
};

export default EventCard;
