#!/bin/bash

# Ensure you export these at cloudrun on within the script.
# export DD_APM_ENABLED=true
# export DD_DOGSTATSD_NON_LOCAL_TRAFFIC=true
# export DD_API_KEY=$DATADOG_API_KEY
# export DD_PROCESS_AGENT_ENABLED=true
# export DD_APM_IGNORE_RESOURCES="(GET|POST) /healthz"
# export DD_APM_FILTER_TAGS_REJECT="http.url:/eubb1024/api/client/features"
# export DD_SITE='datadoghq.com'

echo "starting dd agent, waiting for port UDP/8125 to be open..."
agent run 1>/dev/null &
while ! nc -z -u localhost 8125; do
  echo 'Trying to connect to port UDP/8125 for dd agent healthcheck'
  sleep 1
done
echo 'dd agent initialized successfully'

echo "starting trace agent, waiting for port TCP/8126 to be open..."
trace-agent -config /etc/datadog-agent/datadog.yaml 1>/dev/null &
while ! nc -z localhost 8126; do
  echo 'Trying to connect to port TCP/8126 for dd traceagent healthcheck'
  sleep 1
done
echo 'dd trace agent initialized successfully'

echo "starting start script"
./start.sh
echo "finished start script"
