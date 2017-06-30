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

## Dataset

The application provides access to the [Gridded Meteorological Data: 1949-2010](http://www.engr.scu.edu/~emaurer/gridded_obs/index_gridded_obs.html) by Maurer et al, 2002. The dataset is stored in a PostgreSQL database.

> Maurer, E.P., A.W. Wood, J.C. Adam, D.P. Lettenmaier, and B. Nijssen, 2002, A Long-Term Hydrologically-Based Data Set of Land Surface Fluxes and States for the Conterminous United States, J. Climate 15, 3237-3251.

## Application Components

- Client-side web application (AngularJS/d3)
- Server-side web application (Node/Express)
- Database (PostgreSQL)
- Job Queue (kue/redis)

## Development/Production Server

### Secrets

In order to run the app successfully, you'll need access to the S3 bucket where the 
runs are stored. You need a secret (password) for this: email Tim Adams at tbadams45@gmail.com to get it.

When you do get it, create a file at ~/.aws/credentials with the following contents:

```
[default]
aws_access_key_id = SAME_AS_BELOW_OR_WHATEVER_YOU_HAD_ORIGINALLY
aws_secret_access_key = SAME_AS_BELOW_OR_WHATEVER_YOU_HAD_ORIGINALLY

[weathergen-api]
aws_access_key_id = ACCESS_KEY_ID_ILL_SEND_YOU
aws_secret_access_key = SECRET_ACCESS_KEY_ILL_SEND_YOU

```

### Installing the server

Spin up a new Ubuntu 16.04 instance on EC2 or elsewhere. (Or just run on Virtualbox/your local machine). Then run:

```bash
sudo apt-get update
sudo apt-get install git

# get the app
git clone https://github.com/tbadams45/climate-stress-tool.git
cd climate-stress-tool

# install necessary libaries and pacakages
./setup.sh
cd worker
./setup.sh
```

If you can't run the setup.sh files, try using `chmod u+x setup.sh` in both the main and the worker directory.

### Running the server

#### Production server

To run the production server:

Start redis server in one terminal:
```
redis-server
```

Start npm in another terminals:
```
npm start
```

Start worker app in another terminal:
```
cd worker
node app.js
```

#### Development server

To run the development server:

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
