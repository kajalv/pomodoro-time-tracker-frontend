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


## Running Selenium .side

1. Download Selenium IDE extension [for Chrome](https://www.seleniumhq.org/selenium-ide/).
2. You will need `selenium-side-runner` in order to run the `.side` file through CLI. I have included `selenium-side-runner` into the `package.json`, so you should have it ready after running `npm install`. Run `npm install -g chromedriver` to install the required web driver and you are good to go. Check [HERE](https://www.seleniumhq.org/selenium-ide/docs/en/introduction/command-line-runner/) for further details.
3. You have two options to run the `.side` test cases: through Selenium IDE Chrome extentions or through CLI.
4. For Selenium IDE, click the Selenium icon on top-right corner and import the existed `.side` file.
5. For CLI, `selenium-side-runner ./test/PTTWeb3Tests.side` allows you to see the intermediate process along the testing. Use `selenium-side-runner -c "browserName=chrome chromeOptions.args=[disable-infobars, headless]" ./test/PTTWeb3Tests.side` to run headlessly (without opening/closing a browser window).
