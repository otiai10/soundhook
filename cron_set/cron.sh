cnt=1
while true
    do
        echo ">>>$cnt"
        node ./cron_set/twitterYoutube.js
        cnt=`expr $cnt + 1`
        # sleep 20min
        sleep 1200
    done
