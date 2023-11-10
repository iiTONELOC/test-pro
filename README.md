# TestPRO

**`UNDER DEVELOPMENT`**

## Screenshot

![Screenshot](./assets/screenshots/testpro-inprogress.png)

## Description

### COMING SOON

Test Pro is a studying tool designed to help you study for exams and retain information.

This project was created using `bun init` in bun v1.0.3. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.

### Motivation

I am a FullStack Web Developer and CyberOps Engineering Student currently preparing for CompTIA Exams, particularly Security+, Network+, and hopefully the CySA+. I hope to take the exams in the coming months. While I can read my study materials thoroughly, I recognize the need for a more effective way to review and consolidate the information. The goal is to develop a digital tool akin to flashcards, organized for comprehensive review and progress tracking.

### User Story

`As a learner, I want to create quiz questions to reinforce my understanding of various topics and prepare for my exams. The ability to revisit and retake these quizzes is important to me. Additionally, I would like to review questions associated with a specific topic. Post-quiz, I aim to review both correct and incorrect answers, assess my score, and evaluate the time I spent on the quiz. Although accessing this tool across multiple devices is desirable, it's currently not a priority, as I can effectively study using a single computer for now.`

## Tech Stack

- Bun
- Typescript
- Express
- Mongoose ODM
- Mongo DB
- Preact

## Usage

### Installation

This project requires a local installation of MongoDB or use of Mongo Atlas.
If you do not have MongoDB installed on your computer [you can follow the instructions for the community edition in this link](https://www.mongodb.com/docs/manual/installation/).

From the root of the project run the following command to install the dependencies:

```bash
bun install
```

### Creating Environment Variables

This project relies on the following environment variables:

```md
DB_NAME = '<dbname>'
TEST_DB_NAME = '<test-db>'
DB_URI = 'mongodb://localhost:27017/'
```

To create the file run the following command:

```bash
bun createEnv
```

Be sure to replace the default values inside of the parenthesis \' \' with your own database names and the URI to your MongoDB if you are using MongoAtlas over the local installation

### Tests

To verify tests run:

```bash
bun test
```

### Running in Development

#### Front End and API Server

This will start the API sever and load the Vite dev environment for the front-end.

```bash
bun dev
```

#### Just the Front End

```bash
bun dev-client
```

#### Just the API Server

```bash
bun dev-server
```
