import 'dotenv/config'
import request from 'request'
import fs from 'fs'

const key = process.env.KEY;

request.get('https://api.mindat.org/geomaterials/', { headers: { 'Authorization': 'Token ' + key }})