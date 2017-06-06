import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
} from 'react-native';

export default class Post extends Component {

  constructor(props) {
    super(props);
    this.state = {
      foto: props.foto
    }
  }

  render() {
    return (
      <View>
        <View style={styles.cabecalho}>
          <Image style={styles.fotoPerfil}
              source={require('../../resources/img/instagram1.jpg')} />
          <Text>{this.state.foto.usuario}</Text>
        </View>

        <Image style={styles.foto}
            source={require('../../resources/img/instagram1.jpg')} />

        <View style={styles.rodape}>
          <Image style={styles.icone}
            source={require('../../resources/img/heart.png')} />
        </View>
      </View>
    );
  }
}

const width = Dimensions.get('window').width;
const styles = StyleSheet.create({
  cabecalho: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 10,
    height: 40
  },
  fotoPerfil: {
    marginRight: 10,
    height: 40,
    width: 40,
    borderRadius: 20
  },
  foto: {
    width: width,
    height: width
  },
  rodape: {
    margin: 10,
    height: 40
  },
  icone: {
    height: 30,
    width: 30
  }
});