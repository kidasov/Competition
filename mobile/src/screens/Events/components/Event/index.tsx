import React, { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import { Card, Button } from 'react-native-elements';
import moment from 'moment';
import { TimeService } from 'services';

import { API_HOST } from 'api';
import { Event } from 'types';
import { EventType } from 'types/event';

import styles from './styles';

type Props = {
  event: Event;
};

const EventCard: React.FunctionComponent<Props> = (event: Props) => {
  const { name, description, coverMediaId, type, startsAt } = event.event;
  const [currentTime, setCurrentTime] = useState(moment());

  const image = coverMediaId
    ? { uri: `${API_HOST}/storage/${coverMediaId}` }
    : require('assets/images/timo.jpg');

  const renderEventType = () => {
    let eventTypeDescription = 'Не установлен';

    if (type === EventType.Single) {
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

  const renderStartEventTime = () => {
    const date = moment(startsAt).locale('ru').format('D MMMM YYYY, HH:mm');

    return (
      <View style={styles.typeContainer}>
        <Text style={styles.type}>Время начала соревнования:</Text>
        <Text style={styles.typeDescription}>{date}</Text>
      </View>
    );
  };

  const renderTimeLeft = () => {
    if (!startsAt || moment(startsAt).isBefore(currentTime)) {
      return null;
    }

    const timeLeft = TimeService.timeDiff(moment(startsAt), currentTime);

    return (
      <View style={styles.typeContainer}>
        <Text style={styles.type}>До начала соревнования:</Text>
        <Text style={styles.typeDescription}>{timeLeft}</Text>
      </View>
    );
  };

  useEffect(() => {
    console.log('starting timer');
    const countdownTimer = setInterval(() => {
      setCurrentTime(moment());
    }, 1000);
    return () => clearInterval(countdownTimer);
  }, []);


  return (
    <Card containerStyle={styles.card}>
      <Card.Title style={styles.title}>{name}</Card.Title>
      <Card.Divider />
      <Card.Image source={image} />
      {renderEventType()}
      {renderStartEventTime()}
      {renderTimeLeft()}
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
