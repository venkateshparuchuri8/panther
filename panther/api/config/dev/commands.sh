cd /var/www/html/ins-api
export NODE_CONFIG_DIR=/var/www/html/ins-api/config/dev
export NODE_ENV=dev
export LOG4JS_CONFIG=/var/www/html/ins-api/config/dev/log4jconfig.json
forever stop insapi
npm install
forever start -l forever.log -o out.log -e err.log -a --uid insapi ./bin/www
