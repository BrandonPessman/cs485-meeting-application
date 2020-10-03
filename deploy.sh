#!/bin/sh     
ssh root@104.131.115.65 <<EOF       
 cd /var/www/cs485-meeting-application/
 git pull  
 cd /var/www/cs485-meeting-application/frontend 
 npm install
 npm run build
 cd /var/www/cs485-meeting-application/backend
 npm install 
 pm2 restart all
 exit      
EOF