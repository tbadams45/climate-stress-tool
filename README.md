UMass Climate Stress Tool
=========================

Climate Stress Tool developed by the [UMass HydroSystems Research Group](http://cee.umass.edu/cee/hydrosystems).

Original application developed by [Jeffrey D. Walker, PhD](http://walkerjeff.com) in 2015.

This application is a web-based interface to the [weathergen R package](http://walkerjeffd.github.io/weathergen), which contains a semi-parametric stochastic weather generator developed by Scott Steinschneider. More details on the weather generator are available in:

> Steinschneider, S., & Brown, C. (2013). A semiparametric multivariate, multisite weather generator with low-frequency variability for use in climate risk assessments. Water Resources Research, 49(11), 7205–7220. doi:10.1002/wrcr.20528

## Overview

The Climate Stress Tool web application is comprised of:

- a REST API for retrieving climate datasets and submitting jobs for running the weather generator
- a client-side application for fetching historical data (or uploading data in text files), running the weather generator, and downloading the results

It's currently running at 

## Dataset

The application provides access to the [Gridded Meteorological Data: 1949-2010](http://www.engr.scu.edu/~emaurer/gridded_obs/index_gridded_obs.html) by Maurer et al, 2002. The dataset is stored in a PostgreSQL database.

> Maurer, E.P., A.W. Wood, J.C. Adam, D.P. Lettenmaier, and B. Nijssen, 2002, A Long-Term Hydrologically-Based Data Set of Land Surface Fluxes and States for the Conterminous United States, J. Climate 15, 3237-3251.

## Application Components

- Client-side web application (AngularJS/d3)
- Server-side web application (Node/Express)
- Database (PostgreSQL)
- Job Queue (kue/redis)

## Development/Production Server

### Installing the server

Spin up a new Ubuntu 16.04 instance on EC2 or elsewhere. (Or just run on Virtualbox/your local machine). Then run:

```bash
sudo apt-get update
sudo apt-get install git

# get the app
git clone https://github.com/tbadams45/climate-stress-tool.git
cd climate-stress-tool

# install necessary libaries etc.
./setup.sh
cd worker
./setup.sh

npm install
npm install -g bower
npm install -g grunt
npm install -g nodemon
# npm may complain at you and ask what version of angular to install. Install ~1.6.4.
```

You'll then need to install the R packages. So boot up an R terminal from the main directory:

```bash
R
```

And then run the installation script.

```
> source("install_packages.R")
```

If you can't run the setup.sh files, try using `chmod u+x setup.sh` in both the main and the worker directory.

### Running the server

To run the server for the first time, you'll need to follow the development server steps.

#### Production server

Start redis server, npm, and worker all in the background in one terminal:

```
(redis-server &)>redis-log.log
(npm start &)>npm-log.log
cd worker
(node app.js &)>worker-log.log

# if it says node isn't installed, in the worker app try this
# make sure you're in the worker/ directory
# . ~/.nvm/nvm.sh
# nvm use 6.3.1
# (node app.js &)>worker-log.log
```

#### Development server

Start redis server in one terminal:

```
redis-server
```

Start grunt and npm in two separate terminals:

```
grunt dev
npm run dev
```

Start worker app in another terminal:

```
cd worker
node app.js
```

The application is accessible at `http://localhost:3000/`

The job queue is accessible at `http://localhost:3000/jobs`


## Limitations

- The current server set up is rather... brittle. A good first step would be to wrap the app in some kind of process that ensures it will restart after a crash. There are plenty such available.
- The current server is only exposed at port 3000, not port 80. This could be solved by setting up a webserver with a application like nginx, I think.
- The app will reject any input data that does not include any of the expected input variables ([DATE, PRCP, TEMP, TMIN, TMAX, WIND]), namely wind. I'm not sure what happens algorithmically if you just put wind = 0 for all rows, but it might be worth a shot. 
- The API exposing the weathergen package is currently coupled to the UI, in the sense that it's all bound up in this one project. See [https://github.com/tbadams45/weathergen-api](https://github.com/tbadams45/weathergen-api) for a project that attempts to provide the API on its own to be used by other web services such as [Open Agua](https://github.com/OpenAgua/OpenAgua).

