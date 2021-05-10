import { DrawerNavigationProp } from '@react-navigation/drawer';
import { View } from 'react-native';
import { Icon } from 'react-native-elements';
import styles from './styles';

export type HeaderProps = {
  onPress: () => void;
};

const Header = (props: HeaderProps) => {
  return (
    <View style={styles.hamburger}>
      <Icon
        name="menu"
        onPress={props.onPress}
        size={24}
        color="black"
      />
    </View>
  );
};

export default Header;