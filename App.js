import { StatusBar } from 'expo-status-bar';
import {
  StyleSheet,
  View,
  SafeAreaView,
  Dimensions,
  Platform,
} from 'react-native';
import Calculator from './src/components/Calculator';

const { width, height } = Dimensions.get('window');
const isWeb = Platform.OS === 'web';

export default function App() {
  return (
    <View style={isWeb ? styles.webContainer : styles.container}>
      <View style={isWeb ? styles.phoneFrame : styles.container}>
        <SafeAreaView style={styles.container}>
          <Calculator />
          <StatusBar style="light" />
        </SafeAreaView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  /* Container utama mobile */
  container: {
    flex: 1,
    backgroundColor: '#000',
  },

  /* Background web */
  webContainer: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },

  /* Frame HP yang RESPONSIVE */
  phoneFrame: {
    width: Math.min(width * 0.9, 420),
    height: Math.min(height * 0.9, 820),
    backgroundColor: '#000',
    borderRadius: 32,
    borderWidth: 5,
    borderColor: '#2c2c2c',
    overflow: 'hidden',

    /* Shadow */
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 20,
  },
});
