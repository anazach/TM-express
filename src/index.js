import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import Amplify from 'aws-amplify';
import { Auth } from 'aws-amplify';

Amplify.configure({
   Auth: {
      region: '*',
      userPoolId: '*',
      userPoolWebClientId: '*',
   },
});

const currentConfig = Auth.configure();
console.log(currentConfig)

ReactDOM.render(<App />, document.getElementById("root"));
