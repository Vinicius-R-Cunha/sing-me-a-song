# Sing me a song

A mainly mobile app for for anonymous song recommendation. The more people like a recommendation, more likely it is to be recommended to others.

https://user-images.githubusercontent.com/92492685/167279917-1a0464a2-3206-4154-bf94-2fa9d90dc7d4.mp4

## About

Below are the implemented features:

-   Add song interface
-   Play any video you want
-   Upvote/Downvote a recommendation
-   Filter by the most upvoted ones
-   Get a completely random recommendation

## Technologies

The following tools and frameworks were used in the construction of the project:<br>

<p>
  <img style='margin: 5px;' src='https://img.shields.io/badge/axios%20-%2320232a.svg?&style=for-the-badge&color=informational'>
  <img style='margin: 5px;' src="https://img.shields.io/badge/react-app%20-%2320232a.svg?&style=for-the-badge&color=60ddf9&logo=react&logoColor=%2361DAFB"/>
  <img style='margin: 5px;' src="https://img.shields.io/badge/react_route%20-%2320232a.svg?&style=for-the-badge&logo=react&logoColor=%2361DAFB"/>
  <img style='margin: 5px;' src='https://img.shields.io/badge/styled-components%20-%2320232a.svg?&style=for-the-badge&color=b8679e&logo=styled-components&logoColor=%3a3a3a'>
  <img style='margin: 5px;' src='https://img.shields.io/badge/nodejs%20-%2320232a.svg?&style=for-the-badge&color=blue&logo=javascript&logoColor=%2361DAFB%27'>
  <img style='margin: 5px;' src='https://img.shields.io/badge/express%20-%2320232a.svg?&style=for-the-badge&color=green&logo=express&logoColor=%2361DAFB%27'>
</p>

## How to run

### Clone this Repository

```bash
$ git clone https://github.com/Vinicius-R-Cunha/sing-me-a-song.git
```

### Access front-end directory where you cloned it

```bash
$ cd sing-me-a-song/front-end
```

### Install dependencies

```bash
$ npm i
```

### Create an environment variables file in the project root (.env) and configure a variable with the name 'REACT_APP_BACK_URL' that contains the url where the backend will be running, Example:

```bash
REACT_APP_API_BASE_URL=http:localhost:5000/
```

### Then access back-end directory where you cloned it

```bash
$ cd sing-me-a-song/back-end
```

### Install dependencies

```bash
$ npm i
```

### Create an environment variables file in the project root (.env) and configure a variable with the name 'DATABASE_URL' that contains the url where your database is running, Example:

```bash
DATABASE_URL=postgres://<username>:<password>@localhost:5432/sing-me-a-song/
NODE_ENV=development
```

### Run this command on your back-end directory

```bash
$ npx prisma generate
```

### Then run your back-end with

```bash
$ npm run dev
```

### Finally run your front-end with

```bash
$ npm start
```

### This command will open your favorite browser and access http://localhost:3000 by default
