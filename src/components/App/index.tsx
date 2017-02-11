import * as React from "react";

import * as styles from "./index.css";

export default class App extends React.Component<void, void> {

  render() {
    return (
      <div className={styles.container}>
        Hello World!
      </div>
    );
  }
}
