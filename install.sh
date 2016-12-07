#!/bin/bash

# Installation script for MoVR.
# Checkes for the following packages:
#	wget, python
# Then, install pip & django if necessary

echo -e "\e[93mMoVR Installation Process\e[39m"
echo -e "\e[91mTHIS SCRIPT MUST BE RUN AS ROOT. IF IT ISN'T, IT WILL PROBABLY FAIL. SORRY NOT SORRY."
echo -e "\e[93mChecking for required packages...\e[39m"

if hash wget 2>/dev/null; then
	echo -e "\e[92mwget is installed!\e[39m"
else
	echo -e "\e[91mwget isn't installed.  Please install it through your package manager and re-run installation.\e[39m"
	exit
fi

if hash python 2>/dev/null; then
	echo -e "\e[92mpython is installed!\e[39m"
else
	echo -e "\e[91mpython isn't installed.  Please install it through your package manager and re-run installation.\e[39m"
	exit
fi

if hash pip 2>/dev/null; then
	echo -e "\e[92mpip is installed!\e[39m"
else
	echo -e "\e[91mpip isn't installed.  Installing pip...\e[39m"
	wget "https://bootstrap.pypa.io/get-pip.py"
	python get-pip.py
	echo -e "\e[92mFinished installing pip.\e[39m"
fi

if hash django-admin 2>/dev/null; then
	echo -e "\e[92mDjango is installed!\e[39m"
else
	echo -e "\e[91mDjango isn't installed.  Installing Django...\e[39m"
	pip install django
	echo -e "\e[92mFinished installing Django.\e[39m"
fi

echo -e "\e[92mRunning Django database migrations...\e[39m"
python manage.py migrate
echo -e "\e[92mDone.  Run 'python manage.py runserver 0.0.0.0:8000' to start server on port 8000.  Be warned, though, you'll have to add this server's IP to ALLOWED_HOSTS in settings.py.  Have fun, be safe, build responsible rooms!\e[39m"