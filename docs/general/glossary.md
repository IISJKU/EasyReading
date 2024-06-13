# Glossary

## Terminology
- `Node.js:` As an asynchronous event-driven JavaScript runtime, Node.js is designed to build scalable network applications.

- `MySQL:` A MySQL or similar database is needed to run the Easy Reading framework. The database is utilized to store all user data, sessions and so on.

- `HTTPS:` This is just a normal web-server hosting the JS/CSS files to inject

- `Websocket:` A websocket server that is used to communicate with the extension. 

## Client
- `Background script:` Privileged script, only one instance of this script is running, manages tabs and windows and communicates to the content script of each tab

- `Content script:` Privileged script, one instance per tab, communicates with background script, has direct access to the pages DOM, but not the it's JavaScript)

- `Page script:` JavaScript of the web-page, has no privileges