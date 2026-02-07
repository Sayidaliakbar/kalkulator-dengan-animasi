import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Animated,
  Vibration,
  StatusBar,
  SafeAreaView, // Penting untuk HP ber-poni
  Dimensions,
} from 'react-native';

const isWeb = Platform.OS === 'web';
const { width, height } = Dimensions.get('window');

// --- PENGATURAN UKURAN DINAMIS ---
// Jika layar kecil (HP), font lebih kecil. Jika lebar (Laptop), font besar.
const isSmallScreen = width < 400;
const baseFontSize = isSmallScreen ? 28 : 36;
const displayFontSize = isSmallScreen ? 60 : 80;
const buttonGap = isSmallScreen ? 8 : 12;

// --- KOMPONEN TOMBOL ANIMASI ---
const AnimatedButton = ({ text, onPress, style, textStyle, flexSize = 1 }) => {
  const scaleValue = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    if (!isWeb) Vibration.vibrate(30);
    Animated.spring(scaleValue, {
      toValue: 0.9,
      useNativeDriver: true,
      speed: 50,
      bounciness: 5,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleValue, {
      toValue: 1,
      useNativeDriver: true,
      speed: 50,
      bounciness: 5,
    }).start();
    if (onPress) onPress();
  };

  return (
    <View style={{ flex: flexSize, padding: isSmallScreen ? 3 : 6 }}>
      <Animated.View style={[{ flex: 1, transform: [{ scale: scaleValue }] }]}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          style={[styles.button, style]}
        >
          <Text style={[styles.buttonText, textStyle]}>{text}</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

// --- LOGIKA UTAMA ---
export default function Calculator() {
  const [display, setDisplay] = useState('0');
  const [operator, setOperator] = useState(null);
  const [firstValue, setFirstValue] = useState(null);
  const [waitingForSecond, setWaitingForSecond] = useState(false);

  // Animasi Display
  const displayScale = useRef(new Animated.Value(1)).current;

  const triggerDisplayAnimation = () => {
    Animated.sequence([
      Animated.timing(displayScale, { toValue: 1.1, duration: 50, useNativeDriver: true }),
      Animated.timing(displayScale, { toValue: 1, duration: 50, useNativeDriver: true }),
    ]).start();
  };

  const handleNumber = (num) => {
    if (waitingForSecond) {
      setDisplay(num);
      setWaitingForSecond(false);
      triggerDisplayAnimation();
    } else {
      setDisplay(display === '0' ? num : display + num);
    }
  };

  const handleOperator = (op) => {
    setFirstValue(parseFloat(display));
    setOperator(op);
    setWaitingForSecond(true);
  };

  const calculate = () => {
    const secondValue = parseFloat(display);
    let result = 0;

    switch (operator) {
      case '+': result = firstValue + secondValue; break;
      case '-': result = firstValue - secondValue; break;
      case '×': result = firstValue * secondValue; break;
      case '÷': result = secondValue === 0 ? 0 : firstValue / secondValue; break;
      default: return;
    }
    
    let finalResult = String(result);
    // Potong desimal jika terlalu panjang
    if (finalResult.length > 10) {
      finalResult = result.toPrecision(8).toString();
    }

    triggerDisplayAnimation();
    setDisplay(finalResult);
    setOperator(null);
    setFirstValue(null);
    setWaitingForSecond(false);
  };

  const clear = () => {
    setDisplay('0');
    setOperator(null);
    setFirstValue(null);
    setWaitingForSecond(false);
  };

  const toggleSign = () => setDisplay((parseFloat(display) * -1).toString());
  const percent = () => setDisplay((parseFloat(display) / 100).toString());

  const renderButton = (text, onPress, type = 'number', flexSize = 1) => {
    let buttonStyle = styles.numberButton;
    let textStyle = styles.numberText;

    if (type === 'operator') {
      buttonStyle = styles.operatorButton;
      textStyle = styles.operatorText;
    } else if (type === 'action') {
      buttonStyle = styles.actionButton;
      textStyle = styles.actionText;
    } else if (type === 'equal') {
      buttonStyle = styles.equalButton;
    }

    return (
      <AnimatedButton 
        text={text} 
        onPress={onPress} 
        style={buttonStyle} 
        textStyle={textStyle}
        flexSize={flexSize} 
      />
    );
  };

  return (
    // SafeAreaView menjamin tampilan aman dari 'poni' HP
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      
      <View style={styles.mainContainer}>
        
        {/* BAGIAN LAYAR (30% Tinggi) */}
        <View style={styles.displaySection}>
          <Animated.Text 
            style={[styles.displayText, { transform: [{ scale: displayScale }] }]} 
            numberOfLines={1}
            adjustsFontSizeToFit // Ini kunci agar angka panjang mengecil otomatis
          >
            {display}
          </Animated.Text>
        </View>

        {/* BAGIAN TOMBOL (70% Tinggi) */}
        <View style={styles.keypadSection}>
          <View style={styles.row}>
            {renderButton('AC', clear, 'action')}
            {renderButton('+/-', toggleSign, 'action')}
            {renderButton('%', percent, 'action')}
            {renderButton('÷', () => handleOperator('÷'), 'operator')}
          </View>
          <View style={styles.row}>
            {renderButton('7', () => handleNumber('7'))}
            {renderButton('8', () => handleNumber('8'))}
            {renderButton('9', () => handleNumber('9'))}
            {renderButton('×', () => handleOperator('×'), 'operator')}
          </View>
          <View style={styles.row}>
            {renderButton('4', () => handleNumber('4'))}
            {renderButton('5', () => handleNumber('5'))}
            {renderButton('6', () => handleNumber('6'))}
            {renderButton('-', () => handleOperator('-'), 'operator')}
          </View>
          <View style={styles.row}>
            {renderButton('1', () => handleNumber('1'))}
            {renderButton('2', () => handleNumber('2'))}
            {renderButton('3', () => handleNumber('3'))}
            {renderButton('+', () => handleOperator('+'), 'operator')}
          </View>
          <View style={styles.row}>
            {renderButton('0', () => handleNumber('0'), 'number', 2)}
            {renderButton('.', () => handleNumber('.'))}
            {renderButton('=', calculate, 'equal')}
          </View>
        </View>

      </View>
    </SafeAreaView>
  );
}

// --- STYLING ---
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#000000',
  },
  mainContainer: {
    flex: 1,
    backgroundColor: '#000000',
    padding: isSmallScreen ? 10 : 20, // Padding lebih kecil di HP
  },

  /* DISPLAY AREA */
  displaySection: {
    flex: 3, // Mengambil porsi 30%
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#222',
    marginBottom: 10,
  },
  displayText: {
    color: '#00F0FF',
    fontSize: displayFontSize, 
    fontWeight: '300',
    textAlign: 'right',
    textShadowColor: 'rgba(0, 240, 255, 0.5)', 
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },

  /* KEYPAD AREA */
  keypadSection: {
    flex: 7, // Mengambil porsi 70%
  },
  row: {
    flex: 1, 
    flexDirection: 'row',
    marginBottom: isSmallScreen ? 0 : 5, // Kurangi margin bottom di HP
  },

  /* GLOBAL BUTTON STYLE */
  button: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: isSmallScreen ? 12 : 16, // Radius lebih kecil di HP
    // Tidak ada height fixed, dia akan ngikutin flex parentnya
  },
  buttonText: {
    fontSize: baseFontSize,
    fontWeight: '500',
  },

  /* WARNA NEON */
  numberButton: {
    backgroundColor: '#1E1E2E', 
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  numberText: { color: '#FFFFFF' },

  actionButton: { backgroundColor: '#2D0055' },
  actionText: { color: '#D08FFF' }, 

  operatorButton: { backgroundColor: '#003344' },
  operatorText: { color: '#00F0FF' },

  equalButton: {
    backgroundColor: '#FF0055',
    shadowColor: '#FF0055',
    shadowOpacity: 0.4,
    shadowRadius: 10,
  },
});