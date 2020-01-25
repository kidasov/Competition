import { StyleSheet } from 'react-native';
import Fonts from 'assets/fonts';

const styles = StyleSheet.create({
  button: {
    borderRadius: 0,
    marginLeft: 0,
    marginRight: 0,
    marginBottom: 0,
    backgroundColor: '#ff8a65',
  },

  text: {
    marginBottom: 10,
    fontFamily: Fonts.ALLEGREYA,
  },

  title: {
    fontWeight: '400',
    fontFamily: Fonts.ALLEGREYA,
  },

  buttonTitle: {
    fontFamily: Fonts.ALLEGREYA,
  },

  card: { borderRadius: 4, margin: 16, fontFamily: Fonts.ALLEGREYA },
});

export default styles;
