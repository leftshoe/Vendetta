#!/bin/bash

adt -package -storetype pkcs12 -keystore ../defazioCert.pfx Vendetta Sample-app.xml sample.*
