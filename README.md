# AI Assessment Tool

- [AI Assessment Tool](#ai-assessment-tool)
  - [Overview](#overview)
    - [Demo](#demo)
  - [Features 🤩](#features-)
  - [Requirements](#requirements)
  - [Steps to run this on your local](#steps-to-run-this-on-your-local)
    - [If you want to run the project using docker](#if-you-want-to-run-the-project-using-docker)
  - [What's next 🚀](#whats-next-)
  - [Tech stacks](#tech-stacks)
  - [Contributing](#contributing)
  - [License](#license)

## Overview

This application is an improvement on the [ALTAI tool](https://futurium.ec.europa.eu/en/european-ai-alliance/pages/welcome-altai-portal) with some additional features.

### [Demo](https://ai-assessment-tool-ai4belgium.vercel.app/)

## Features 🤩

- Login/Register with JWT token authentication
- Ability to create/update/delete the project
- Ability to add/update/move/delete the card
- Invite user to the project
- Assign a card to the user
- Comment on cards

## Requirements

1. [Node.js](https://nodejs.org/)
2. [npm](https://www.npmjs.com/)
3. [Docker](https://www.docker.com/)

## Steps to run this on your local

First install the MongoDB Compass for better visualization of data with MongoDB server.

1. Clone this repo using `git clone git@github.com:AI4Belgium/AI-Assessment-Tool.git`
2. Create _.env.local_ and add this env variable `LOCAL_MONGODB=mongodb://localhost:27017/trello`
    Add `JWT_SECRET_KEY=randomstrings`
3. Run `yarn install`
4. Run `yarn dev`

### If you want to run the project using docker

Install docker on your machine and start it

1. Create _.env.development_ file.
2. Add `LOCAL_MONGODB=mongodb://mongodb:27017/trello`
3. Run `docker-compose up`

## What's next 🚀

- Add testing
- Improve styling (responsiveness styling)
- Add Web Accessibility

## Tech stacks

- Nextjs with typescript
- MongoDB for local development
- Mongo Atlas for production DB
- Chakra UI library

## Contributing

All contributions are welcome!

## License

This project is licensed under the **MIT license**. Feel free to edit and distribute this template as you like.

See [LICENSE](LICENSE) for more information.
