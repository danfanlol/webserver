# Dream2Learn website backend

Root directory is the backend project. Preprocessed frontend components can be found in `./pages`.

## Setup

A `.env` file must be created in the root directory of this repository with the following parameters:
```
JWT_SECRET=

MONGO_URL=
FROM_EMAIL=
SENDGRID_API_KEY=
SESSION_SECRET=

run-init=true
run-script=true
```

## NPM scripts

A `:dev` suffix indicates a script for development, and `:public` for production. By default, the server will be hosted on port 3000, which can be specified via the `PORT` environment variable.

Script | Description
-|-
`build-frontend-hot:dev` | Builds the frontend apps in `./pages/` and rebuilds them when their source code changes.
`build-frontend:dev`<br />`build-frontend:public` | Builds the frontend apps in `./pages/` once.
`server:dev`<br />`server:public` | Starts the backend server. If `:dev`, the server will restart when its source code changes.
`start:dev`<br />`start:public` | Builds the frontend apps in `./pages/` and then starts the server. If `:dev`, the frontend apps and the server will update when their respective source code changes.
`install-subdir-deps` | Installs the dependencies of the frontend apps in `./pages/`.
`heroku-postbuild` | Automatically called when deploying to Heroku. Runs `install-subdir-deps` and then `build-frontend:public`.