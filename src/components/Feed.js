import React, { Component } from 'react';
import {
  StyleSheet,
  AsyncStorage,
  FlatList,
  Platform,
  ToastAndroid,
  View,
  TouchableOpacity,
  Text
} from 'react-native';
import { Navigation } from 'react-native-navigation';

import Post from './Post';
import fetchInstaluraApi from '../api/fetchInstaluraApi';
import exibeNotificacao from '../util/NotificacaoUtils';

export default class Feed extends Component {

  constructor() {
    super();
    this.state = {
      fotos: [],
      status: 'NORMAL'
    }
  }

  componentDidMount() {
    this.carregaFotos();
  }

  carregaFotos() {
    fetchInstaluraApi('/fotos')
      .then(fotos => this.setState({fotos, status: 'NORMAL'}))
      .catch(erro => {
        this.setState({status: 'FALHA_CARREGAMENTO'});
      });
  }

  buscaPorId(idFoto) {
    return this.state.fotos.find(foto => foto.id === idFoto);
  }

  atualizaFotos(fotoAtualizada) {
    const fotos = this.state.fotos
        .map(foto => foto.id === fotoAtualizada.id ? fotoAtualizada : foto);

    this.setState({fotos});
  }

  like(idFoto) {
    const listaOriginal = this.state.fotos;
    const foto = this.buscaPorId(idFoto);

    AsyncStorage.getItem('usuario')
      .then(usuario => {

        let novaLista = [];
        if(!foto.likeada) {
          novaLista = [
            ...foto.likers,
            {login: usuario}
          ];
        } else {
          novaLista = foto.likers.filter(liker => {
            return liker.login !== usuario;
          });
        }
        return novaLista;
      })
      .then(novaLista => {
        const fotoAtualizada = {
          ...foto,
          likeada: !foto.likeada,
          likers: novaLista
        };
        this.atualizaFotos(fotoAtualizada);
      });

    const uri = `/fotos/${idFoto}/like`;
    fetchInstaluraApi(uri, 'POST')
      .catch(erro => {
        exibeNotificacao(erro);
        this.setState({fotos: listaOriginal});
      });
  }

  comenta(idFoto, valorComentario, inputComentario) {
    if(valorComentario === '')
      return;

    const foto = this.buscaPorId(idFoto);

    const uri = `/fotos/${idFoto}/comment`;
    fetchInstaluraApi(uri, 'POST', {texto: valorComentario})
      .then(comentario => {
        const novaLista = [
          ...foto.comentarios,
          comentario
        ];
        return novaLista;
      })
      .then(novaLista => {
        const fotoAtualizada = {...foto,
          comentarios: novaLista
        };
        this.atualizaFotos(fotoAtualizada);
      })
      .catch(erro => {
        exibeNotificacao(erro);
      });

      inputComentario.clear();
  }

  render() {
    if(this.state.status !== 'NORMAL') {
      return (
        <TouchableOpacity style={styles.container} onPress={this.carregaFotos.bind(this)}>
          <Text style={[styles.texto, styles.titulo]}>Ops!</Text>
          <Text style={styles.texto}>Não foi possível carregar o feed.</Text>
          <Text style={styles.texto}>Toque para tentar novamente</Text>
        </TouchableOpacity>
      );
    }

    return (
      <FlatList
          data={this.state.fotos}
          keyExtractor={ item => item.id }
          renderItem={ ({item}) =>
              <Post foto={item}
                  likeCallback={this.like.bind(this)}
                  comentaCallback={this.comenta.bind(this)} />
          }/>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  texto: {
    color: '#7f8c8d',
    fontSize: 20
  },
  titulo: {
    fontWeight: 'bold',
    fontSize: 26
  }
});
