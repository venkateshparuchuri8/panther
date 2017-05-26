cd /var/www/html/panther/api
export NODE_CONFIG_DIR=/var/www/config/prod
export NODE_ENV=production
export LOG4JS_CONFIG=/var/www/html/panther/api/config/prod/log4jconfig.json
source ~/.nvm/nvm.sh
nvm use 6.9.5
forever stop pantherapi
npm install
forever start -l forever.log -o out.log -e err.log -a --uid pantherapi ./bin/www
