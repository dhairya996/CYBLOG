#!/usr/bin/env python
from zapv2 import requests
headers = {
  'Accept': 'application/json',
  'X-ZAP-API-Key': 'p7k01upida279hlhu3qtr74si3'
}

r = requests.get('http://zap/JSON/alert/view/alertsSummary/', params={

}, headers = headers)

print(r.json())