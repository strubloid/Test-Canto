import React from "react";
import { Provider } from "react-redux";
import ReactDOM from "react-dom/client";
import store from "./store";
import { ErrorProvider } from "./context/ErrorContext";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import "./index.css";

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
root.render(
    <Provider store={store}>
        <ErrorProvider>
            <React.StrictMode>
                <App />
            </React.StrictMode>
        </ErrorProvider>
    </Provider>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
