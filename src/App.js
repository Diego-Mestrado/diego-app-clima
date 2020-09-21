import React, { Fragment, useState, useEffect } from 'react';//Fragment(Retorna valores vazios), useState (permissao da location pelo usuario) e useEffect (tem sua funcionalidade ativada apos o app rodar)
import axios from 'axios'; //Importando a biblioteca axios para poder fazer as chamadas para web
export default App;

function App() {
  const [location, setLocation] = useState(false);//Serve para apresentar a permissao do usuario referente a location 
  const [weather, setWeather] = useState(false);//Criado com o objetivo de guardar os dados que vem da API para depois serem exibidos na aplicacao
  
  let getWeather = async (lat, long) => {//Funcao responsavel pela chamada da API externa (A utilizacao do async e await é para tornar a chamada assincrona)
    let res = await axios.get("http://api.openweathermap.org/data/2.5/weather", {//Chamada da biblioteca axios // Nessa parte e apresentada a URL da documentacao relacionada ao clima da pagina da OpenWeather
      params: {//parametros referentes ao clima
        lat: lat,//parametros de latitude
        lon: long,//parametros de longitude
        appid: process.env.REACT_APP_OPEN_WHEATHER_KEY,//Chamada da variavel de ambiente da credencial da OpenWeather
        lang: 'pt',//Versao em portugues
        units: 'metric'//unidades metricas
      }
    });
    setWeather(res.data);//Resposta de retorno da API
  } 

  useEffect(()=> {
    navigator.geolocation.getCurrentPosition((position)=> {//Aqui esta sendo chamado o codigo que faz a leitura das coordenadas da localizacao do usuario do app
      getWeather(position.coords.latitude, position.coords.longitude);//Aqui e passado como argumento para esse metodo uma outra funcao que vai receber as coordenadas de latitude e longitude 
      setLocation(true)//Confirma que a localizacao esta correta
    })
  }, [])//Foi gerado um array vazio para o useEffect ser chamado apenas uma vez quando o app executar

  if(location === false){//Condicional criada para verificar a confirmacao de autorizacao do usuario sobre a localizacao
    return (
      <Fragment>
        Você precisa habilitar a localização no browser o/ 
      </Fragment>
    )
  }else if (weather === false) {//Condicional criada para apresentar a mensagem "Carregando o clima..." enquanto carrega as informacoes da API referentes ao clima 
    return(
      <Fragment>
        Carregando o Clima...
      </Fragment>
    )
  }else{//Apresenta as informacoes sobre o clima
    return (//valores de retorno da API referentes a temperatura atual, temperatura maxima, temperatura minima, pressao e humidade
      <Fragment>
        <h3>Clima nas suas Coordenadas ({weather['weather'][0]['description']})</h3>
        <hr />
          <ul>
           <li>Temperatura atual: {weather['main']['temp']}º</li>
            <li>Temperatura máxima: {weather['main']['temp_max']}º</li>
            <li>Temperatura mínima: {weather['main']['temp_min']}º</li>
            <li>Pressão: {weather['main']['pressure']}hpa</li>
            <li>Humidade: {weather['main']['humidity']}% </li>
          </ul>
      </Fragment>
    );
  }
}
