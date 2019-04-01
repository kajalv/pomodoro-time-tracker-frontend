# Project repository for 6301Spring19::Web3

Team Members: tkang49, ywang3550, kvarma3, yhu388

Read Access:  None


## Installation
All following commands should be run under `PTTWeb3` directory.

Install dependencies:
```
npm install
```


## Project structure
```bash
├── package-lock.json
├── package.json
├── public
│   ├── favicon.ico
│   ├── index.html
│   └── manifest.json
├── src
│   ├── RESTful-APIs
│   ├── assets
│   ├── components
│   ├── constants
│   ├── fakeBackend
│   ├── models
│   ├── pages
└── tsconfig.json
```

## Test

Start a fake backend server at localhost port 8080:
```
npm run dev
```

Start the react server at localhost port 3000:
```
npm run start
```

Start both fake backend and react server in two terminals.

Open [http://localhost:3000](http://localhost:3000) in your browser to view the website.

Use `admin` as Admin Id to login into admin page, where you can view, create, edit and delete users.

Use created user email or `a` (predefined test user) to login into user page, where you can view, create, edit and delete projects.


## Front End Tests

### Steps To Run

First, follow the steps above to install the front end and start the React server. The server needs to be running at `localhost:3000`.  
There are two options to run the `.side` test cases: through Selenium IDE Chrome extentions or through CLI.

### Selenium IDE Extension

1. Download Selenium IDE extension [for Chrome](https://www.seleniumhq.org/selenium-ide/).
2. Click the Selenium icon on top-right corner and import the existing `.side` file, i.e. `PTTWeb3/test/PTTWeb3Tests.side`.
3. Click `Run all tests` or launch tests individually to see the outcome.

**NOTE**: The test cases in the `.side` pass when run using the extension.

### Command Line Runner

**NOTE**: The front end tests fail sometimes on CLI possibly due to timing issues with the backend stub that was used to create tests. We expect the issues to be resolved when backend integration is completed. For now, all the tests can be run in the extension GUI and will pass.

1. You will need `selenium-side-runner` in order to run the `.side` file through CLI. `selenium-side-runner` is included in the `package.json`, so you should have it ready after running `npm install`. If not, install it manually with `npm install -g selenium-side-runner`.
2. Run `npm install -g chromedriver` to install the required web driver and you are good to go. Check [HERE](https://www.seleniumhq.org/selenium-ide/docs/en/introduction/command-line-runner/) for further details.
3. Add the path of installation of the chromedriver to the `PATH` environment variable. On MacOS, this looks like:

    export PATH=(full path here)/6301Spring19Web3/PTTWeb3/node_modules/chromedriver/lib/chromedriver:$PATH

4. For CLI, in the `PTTWeb3` directory,
```
selenium-side-runner ./test/PTTWeb3Tests.side
``` 
allows you to see the intermediate process along the testing. Use 
```
selenium-side-runner -c "browserName=chrome chromeOptions.args=[disable-infobars, headless]" ./test/PTTWeb3Tests.side
```
to run headlessly (without opening/closing a browser window).
