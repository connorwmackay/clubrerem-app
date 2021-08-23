# Club ReRem App

## About
This social media app aims to have a club-like feel where users become a part of clubs. I'm still not 100% sure how this
should feel, but the aim is to translate the idea of a school / activity centre that houses clubs that each have their
own club room into digital form.

## Libraries
### Client
- React
- Redux
- TypeScript
- ...
### Server
- Express
- TypeORM
- Postgres
- TypeScript
- ...

## Build
This uses Docker Compose, so you'll need to have it to build this project properly. If you're on windows you'll need WSL2 as well as Docker Desktop. 
Make sure you clone the repo inside your WSL2 distro filesystem because if you clone it on Windows then Docker will cry. If you are on an OS that isn't 
annoying you just need Docker Compose.

You'll want Node.JS on either the WSL2 distro or on your system if you aren't on Windows. You'll probably need to run *npm install* inside both the client and
server folders to run the Docker containers.

Build: *docker-compose up -d --build* <br />
Run: *docker-compose up*

## Documentation
There currently isn't any documentation, however I plan on making some, especially for the REST API so that it's easier to understand the different routes and what they do.

## Contributions
This is just a side project, however feel free to contribute.

To contribute to this project, first fork the repo. Next you should create a new branch that includes a very short description of what the contribution will do and also should include the date as of branch creation at the end of the branch name. This could be something like *profileFix23082021*. Once you've finished your contributions, having commited all the changes to the branch you should send a pull request to the original repo with the changes.

### Pull Request
The pull request should have a descriptive name (*though doesn't need be as long as Java class names lol*). The pull request should ideally be related to an issue, though it doens't have to be. Your comment should explain what the pull request does, but doesn't need to be an essay as your code will be reviewed too.