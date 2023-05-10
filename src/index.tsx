import ReactDOM from "react-dom/client";
import "./styles/app.css";
import App from "./App";

import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
} from "@apollo/client";


const client = new ApolloClient({
  uri: "http://192.168.230.107:4000/",
  cache: new InMemoryCache(),
});

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>
);

