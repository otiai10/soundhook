# watch node process for every 60secs
while true
    do
        result=`ps aux | grep node  | grep $PWD | grep app.js | wc -l`
        if [ "$result" -lt 1 ]; then
            node ./cron_set/alert.js
            date
            exit
        fi
        sleep 1
    done
