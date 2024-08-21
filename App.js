import React from 'react';
import { StyleSheet, View, TextInput, TouchableOpacity, Text, Dimensions, Platform } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { LinearGradient } from 'expo-linear-gradient';

class App extends React.Component {
  state = {
    inputText: '',
    qrCodeValue: '',
  };

  generateQRCode = () => {
    this.setState({ qrCodeValue: this.state.inputText });
  };

  saveQRCode = async () => {
    try {
      const fileUri = `${FileSystem.documentDirectory}qrcode.png`;
      await QRCode.toFileAsync(fileUri, { value: this.state.qrCodeValue, size: 200 });
      console.log(`QR code saved to ${fileUri}`);

      if (Platform.OS === 'ios') {
        await Sharing.shareAsync(fileUri);
      } else {
        await Sharing.shareAsync(fileUri, { UTI: 'com.apple.png', dialogTitle: 'Share QR Code' });
      }
    } catch (error) {
      console.error('Error saving and sharing QR code:', error);
    }
  };

  render() {
    return (
      <LinearGradient
        colors={['#4c669f', '#3b5998', '#192f6a']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.container}
      >
        <View style={styles.animatedBackground}>
          <View style={styles.animatedCircle} />
          <View style={[styles.animatedCircle, styles.animatedCircle2]} />
        </View>
        <TextInput
          style={[styles.input, { fontFamily: 'Poppins-Regular' }]}
          onChangeText={(text) => this.setState({ inputText: text })}
          value={this.state.inputText}
          placeholder="Enter text or link"
          placeholderTextColor="#ccc"
          autoCapitalize="none"
        />
        <LinearGradient
          colors={['#4c69f7', '#a14cf7']} // Blue to violet gradient
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.button}
        >
          <TouchableOpacity onPress={this.generateQRCode} style={styles.buttonContent}>
            <Text style={styles.buttonText}>Generate QR Code</Text>
          </TouchableOpacity>
        </LinearGradient>
        {this.state.qrCodeValue && (
          <View style={styles.qrCodeContainer}>
            <QRCode
              value={this.state.qrCodeValue}
              size={200}
              color="#fff"
              backgroundColor="transparent"
            />
            {/* Uncomment this button if you want to enable saving QR code */}
            {/* 
            <TouchableOpacity
              onPress={this.saveQRCode}
              style={styles.button}
            >
              <Text style={styles.buttonText}>Save QR Code</Text>
            </TouchableOpacity> 
            */}
          </View>
        )}
      </LinearGradient>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  animatedBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    overflow: 'hidden',
  },
  animatedCircle: {
    position: 'absolute',
    width: Dimensions.get('window').width * 2,
    height: Dimensions.get('window').width * 2,
    borderRadius: Dimensions.get('window').width,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    transform: [{ translateX: -Dimensions.get('window').width / 2 }, { translateY: -Dimensions.get('window').width / 2 }],
    animation: 'spin 30s linear infinite',
  },
  animatedCircle2: {
    animationDelay: '10s',
  },
  input: {
    width: '80%',
    height: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 10,
    paddingHorizontal: 20,
    marginVertical: 20,
    fontSize: 16,
    color: '#fff',
  },
  button: {
    borderRadius: 5,
    marginVertical: 10,
    overflow: 'hidden',
  },
  buttonContent: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  qrCodeContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
});

export default App;
