# Udagram Proxy API

This project contains a Proxy API responsible for being an aggregator for all the APIs.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

What things you need to install the software and how to install them:

```
Node 12
Npm 6.13.4
```

#### INSTALLING

##### NODE

1. Access the [download page](https://nodejs.org/en/download/).

2. Follow the instructions defined by the wizard. 

### Running in Development Mode

To run the API execute the following command inside of the root directory:

```
 npm install && npm run dev
```

### Deploying

This application will be deployed by Travis CI when the build is executed. 
Firstly, It will perform the build of the application and create an image based on the generated binary. 
Finally, It will perform the push of the image to 
[Docker Hub](https://hub.docker.com/repository/docker/williamcustodio/udagram_proxy_api) and trigger a deployment to AWS EKS. 
For more information regarding the script please take a look at the files [Makefile](Makefile) 
and also [.travis.yml](.travis.yml).

