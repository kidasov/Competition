import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { Icon } from 'react-native-elements';

import styles from './styles';

const handleClose = props => props.onClose && props.onClose();

const PopupMessage = props => {
  const { text, style } = props;

  return (
    <View style={[styles.container, style]}>
      <Text style={styles.text}>{text}</Text>
      <TouchableOpacity style={{ marginLeft: 20 }} onPress={handleClose}>
        <Icon name="close" size={16} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

export default PopupMessage;
