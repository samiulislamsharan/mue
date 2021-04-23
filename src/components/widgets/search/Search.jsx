import React from 'react';

import EventBus from '../../../modules/helpers/eventbus';

import SearchIcon from '@material-ui/icons/Search';
import MicIcon from '@material-ui/icons/Mic';

import './search.scss';

const searchEngines = require('./search_engines.json');

export default class Search extends React.PureComponent {
  constructor() {
    super();
    this.state = {
      url: '',
      query: '',
      microphone: null
    };
    this.language = window.language.widgets.search;
  }

  startSpeechRecognition = () => {
    const voiceSearch = new window.webkitSpeechRecognition();
    voiceSearch.start();

    const searchText = document.getElementById('searchtext');

    voiceSearch.onresult = (event) => {
      searchText.value = event.results[0][0].transcript;
    };

    voiceSearch.onend = () => {
      setTimeout(() => {
        window.location.href = this.state.url + `?${this.state.query}=` + searchText.value;
      }, 1000);
    };
  }

  searchButton = () => {
    const value = document.getElementById('searchtext').value || 'mue fast';
    window.location.href = this.state.url + `?${this.state.query}=` + value;
  }

  init() {
    let url;
    let query = 'q';
    let microphone = null;

    const setting = localStorage.getItem('searchEngine');
    const info = searchEngines.find((i) => i.settingsName === setting);

    if (info !== undefined) {
      url = info.url;
      if (info.query) {
        query = info.query;
      }
    }

    if (setting === 'custom') {
      url = localStorage.getItem('customSearchEngine');
    }

    if (localStorage.getItem('voiceSearch') === 'true') {
      microphone = <MicIcon className='micIcon' onClick={this.startSpeechRecognition}/>;
    }

    this.setState({
      url: url,
      query: query,
      microphone: microphone
    });
  }

  componentDidMount() {
    EventBus.on('refresh', (data) => {
      if (data === 'search') {
        this.init();
      }
    });
  
    this.init();
  }

  componentWillUnmount() {
    EventBus.remove('refresh');
  }

  render() {
    return (
      <form action={this.state.url} className='searchBar'>
        {this.state.microphone}
        <SearchIcon onClick={this.searchButton}/>
        <input type='text' placeholder={this.language} name={this.state.query} id='searchtext'/>
      </form>
    );
  }
}