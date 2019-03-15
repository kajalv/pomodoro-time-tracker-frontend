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
