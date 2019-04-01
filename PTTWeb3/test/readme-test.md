# Front End Tests

## Steps To Run

First, follow the steps in the `README.md` at the root of the repository to install the front end and start the React server. The server needs to be running at `localhost:3000`.  
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

4. For CLI, 
```
selenium-side-runner ./test/PTTWeb3Tests.side
``` 
allows you to see the intermediate process along the testing. Use 
```
selenium-side-runner -c "browserName=chrome chromeOptions.args=[disable-infobars, headless]" ./test/PTTWeb3Tests.side
```
to run headlessly (without opening/closing a browser window).
