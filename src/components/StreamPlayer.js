import React, { Component } from 'react';
import { WebView } from 'react-native-webview';
import { streamPlayerStyle as styles } from '../styles';

const serverUrl = `${getServerBaseUrl()}`;

import videojsStyle from '../../resources/videojsSource/style.js';
import videojsScript from '../../resources/videojsSource/script';
import videojsScriptIE8 from '../../resources/videojsSource/scriptIE8';

export default class StreamPlayer extends Component {
    constructor(props) {
        super(props);

        if (!this.props.stream || !this.props.stream.id)
            throw new Error('StreamPlayer component require stream object to initialize correctly.')

        this.state = {
            html: generateHtml(this.props.stream.id)
        };
    }

    render() {
        return <WebView allowsInlineMediaPlayback={true} style={styles.webView} source={{ html: this.state.html }} />;
    }
}

function generateHtml(streamId) {
    const head = `<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><style>${videojsStyle}</style><script>${videojsScriptIE8}</script><style>body { margin: 0; padding: 0 }</style></head>`;
    const videoSource = `${serverUrl}/live/${streamId}/index.m3u8`;
    const noPlayerParagraph = `<p class="vjs-no-js">To view this video please enable JavaScript, and consider upgrading to a web browser that<a href="http://videojs.com/html5-video-support/" target="_blank"> supports HTML5 video</a></p>`;
    const player = `<video id="my-player" class="video-js vjs-big-play-centered vjs-fill" controls preload="auto" data-setup='{ "fluid": { "fullscreenToggle": false } }'><source src="${videoSource}" type="video/mp4"></source>${noPlayerParagraph}</video>`;
    const body = `<body><div>${player}</div><script>${videojsScript}</script></body>`;
    return head + body;
}

function getServerBaseUrl() {
    return require('../../playerConfig.json').serverUrl;
}