# watch node process for every 60secs
while true
    do
        result=`ps aux | grep node  | grep app.js`
        if [ "$result" = "" ]; then
            node ./cron_set/alert.js
            date
            exit
        fi
        sleep 1
    done
