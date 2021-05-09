import { ActivityIndicator, SafeAreaView, Text } from 'react-native';
import styles from './styles';


const Loader = () => {
  return (
    <SafeAreaView style={styles.container}>
      <ActivityIndicator size="large" color="#0000ff" />
    </SafeAreaView>
  );
};

export default Loader;
