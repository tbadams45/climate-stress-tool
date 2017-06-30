# install node version manager (nvm)
curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.32.0/install.sh | bash

# Activate nvm
. ~/.nvm/nvm.sh

# Use nvm to install the version of Node.js you intend to use
# Installing Node.js also installs the Node Package Manager (npm) 
nvm install 6.3.1

# Verify that Node.js is installed and running correctly
node -e "console.log('Running Node.js ' + process.version)"

# Install redis
sudo apt-get update
sudo apt-get install redis-server

# Add R repository
sudo echo "deb http://cran.rstudio.com/bin/linux/ubuntu xenial/" | sudo tee -a /etc/apt/sources.list

# Add R to Ubuntu Keyring
gpg --keyserver keyserver.ubuntu.com --recv-key E084DAB9
gpg -a --export E084DAB9 | sudo apt-key add -

# Install R-Base
sudo apt-get update
sudo apt-get install r-base r-base-dev


# Install R package dependencies
sudo apt-get install libcurl4-openssl-dev libssl-dev gawk # not sure if gawk will fix the maps package error?

# Install R packages, because packrat doesn't work with Rscript 
Rscript install_packages.R
# potentially will need to download 0.9-25 version of hydromad into tar.gz., and set up local packages for packrat... hopefully not.
# now, go into r folder and run R to run packrat, to install files
