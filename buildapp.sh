#!/bin/bash


export dtime=`date +"%y-%m-%d-%H:%M:%S"`
export fldr=../release-$dtime
mkdir $fldr

#copy files, filtering out version control hidden files and build files
rsync -r . $fldr --exclude=.git --exclude=lib/SoyToJsSrcCompiler.jar --exclude=*.sh

#extract version number. dots are replaced with dashes.
cd $fldr
export vnum=`cat vendetta-app.xml | perl -n -e'/.versionNumber.(.*)..versionNumber./ && print $1' | sed -e 's/\./-/g'`
export bname=Vendetta-v${vnum}.air

# build .air file
adt -package -storetype pkcs12 -keystore ../defazioCert.pfx $bname vendetta-app.xml *