## tapbampoints-client

This project is a front-end client written in [React](http://reactjs.com) for organizing event sign-ups, tracking quarterly and initiation points, and collecting useful info on member vs. initiate attendance.

### Setup

To get this project running locally, first install all dependencies.

```
npm install
```

The app uses a `.env` file at the project root for sensitive application-wide constants. The `.env` file should be formatted:

```
API_ROOT = http://localhost:8000
CALENDAR_API_ROOT = https://www.googleapis.com/calendar/v3/calendars/tbp.ucsd@gmail.com/events?key=GOOGLE_API_KEY&orderBy=startTime&singleEvents=true
GOOGLE_API_KEY = YOUR_GOOGLE_API_KEY
```

In order for the client to work properly, you also need the API project running simultaneously with the `API_ROOT` set to the port that the API development server is running on e.g., `http://localhost:8000`. See the [API project README](https://github.com/ucsd-tbp/tapbampoints-api/blob/master/README.md) for details on how to setup the API development server. The `CALENDAR_API_ROOT` is the URL for the public Tau Beta Pi Google calendar and the app uses the URL to grab events that officers have created.

Once you have the API running, run `npm start` to start the webpack development server at `localhost:8080`.

### Contributing

A lint script is provided to catch common mistakes like incorrect import strings, uninitialized or misspelled variables, wrapping JS with curly braces in JSX files, and also to enforce consistent use of semicolons, indentation and similar stuff (loosely following the [Airbnb ES6 style guide](https://github.com/airbnb/javascript)). Run the lint script with:

```
npm run lint
```

A couple of files also use [Flow static type checking](https://flowtype.org). Run the Flow server with:

```
npm run flow
```
