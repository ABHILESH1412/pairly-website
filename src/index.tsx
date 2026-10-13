import { render } from 'solid-js/web';
import '@fontsource-variable/bricolage-grotesque';
import '@fontsource-variable/inter';
import '@fontsource-variable/jetbrains-mono';
import './styles/global.css';
import App from './App';

if ('scrollRestoration' in history) history.scrollRestoration = 'manual';

render(() => <App />, document.getElementById('root')!);
