import * as React from "react";
import * as ReactDOM from "react-dom";
import App from "./components/App";

import "./global.css";
import * as styles from "./app.css";

const appContainer = document.createElement("DIV");
appContainer.className = styles.app;

document.body.appendChild(appContainer);

ReactDOM.render(React.createElement(App), appContainer);
