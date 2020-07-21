#!/bin/sh
while ! ip route | grep -oP 'default via .+ dev'; do
	echo "Connection not set, retrying in 1 second";
	sleep 1;
done
sleep 5;
cd ~/Bobbles/
node index
