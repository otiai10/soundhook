#!/bin/sh

case $1 in
  "--help" )
    echo "--help"
    echo "--start"
    echo "--stop" ;;
  "--start" )
    nohup node app dev_soundhook >> log/node.log & ;;
  "--stop" )
    kill -9 `ps aux | grep node | grep dev_soundhook | awk {'print $2'}` ;;
  *)
    echo "Invalid Option";;
esac
