# Getting Started

## Confluence Documentation

[Onboarding & Getting started](https://integriert-studieren-jku.atlassian.net/wiki/x/AQIf)

## Setup

1. Download the Repo. Navigate a console to the location of the files and install the dependencies with `npm install`.
Create a mysql database called “easyreading” with `user: root` and `password: Root%$123`. I suggest using the tool XAMPP, as it makes this very easy. You can find it [here](https://www.apachefriends.org/de/download.html).

`npm start` - If everything is working, there should be no errors and your console should end with the following message:
`Init server complete`

2. Get the Repo for the extension

- [Chrome extension](https://github.com/IISJKU/easy-reading-chrome-extension)
- [Firefox extension](https://github.com/IISJKU/easy-reading-firefox-extension)

By default, this extension uses the cloudendpoint easyreading-cloud.eu - we want to use loacalhost (aka the one that we just launched)
To do this, you need to change the file (which you find in the extension folder) `EasyReading/background/easy-reading.js`

Under _getDefaultConfig_ set `cloudEndpointIndex: 2`.

Normally this says `cloudEndpointIndex: 0`, which points to the production-server easyreading-cloud.eu. Using `cloudEndpointIndex: 2`, points us to localhost.
Reimport the extension.
If everything worked out, the paths should now look like: `https://localhost:8080/client/setup`, which means it is using our local easyreading install.
:::warning:::If the url still says “easyreading” then you have done something wrong.


## Next Steps

To make plugin development easier, i suggest going to `components/plugins/test-plugin` in this repo and change it to your liking.