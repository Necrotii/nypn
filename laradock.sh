#!/bin/bash

# This shell script is an optional tool to simplify
# the installation and usage of laradock with docker-sync.

# To run, make sure to add permissions to this file:
# chmod 755 laradock.sh

# USAGE EXAMPLE:
# Initialize laradock setup: ./laradock.sh install
# Start sync and services: ./laradock.sh up
# Stop containers and sync: ./laradock.sh down

# prints colored text
print_style () {

    if [ "$2" == "info" ] ; then
        COLOR="96m"
    elif [ "$2" == "success" ] ; then
        COLOR="92m"
    elif [ "$2" == "warning" ] ; then
        COLOR="93m"
    elif [ "$2" == "danger" ] ; then
        COLOR="91m"
    else #default color
        COLOR="0m"
    fi

    STARTCOLOR="\e[$COLOR"
    ENDCOLOR="\e[0m"

    printf "$STARTCOLOR%b$ENDCOLOR" "$1"
}

display_welcome() {
    print_style "\nlaradock.sh is a set of utility shell scripts for setting up and running Laradock.\n"
    print_style "These commands should be run from your host machine (not in a workspace bash session).\n\n"
    display_options
}

display_options () {
    printf "Available options:\n";
    print_style "   welcome" "info"; printf "\t\t Show welcome message and development environment instructions.\n"
    print_style "   install" "success"; printf "\t\t Installs docker-sync gem on the host machine and sets up default Laradock environment variables.\n"
    print_style "   up" "success"; printf "\t\t\t Starts docker-sync and runs docker compose with default service containers.\n"
    print_style "   down" "success"; printf "\t\t\t Stops containers and docker-sync.\n"
    print_style "   bash" "success"; printf "\t\t\t Opens bash on the workspace with user laradock.\n"
    print_style "   sync" "info"; printf "\t\t\t Manually triggers the synchronization of files.\n"
    print_style "   clean" "danger"; printf "\t\t Removes all files from docker-sync.\n"
}

if [[ $# -eq 0 ]] ; then
    print_style "Missing arguments.\n" "danger"
    display_welcome
    exit 1
fi

if [ "$1" == "welcome" ] ; then
    display_welcome

elif [ "$1" == "up" ] ; then
    print_style "Starting up development environment\n" "info"
    cd laradock && ./sync.sh up mysql apache2 workspace

elif [ "$1" == "down" ]; then
    print_style "Stopping development environment\n" "info"
    cd laradock && ./sync.sh down

elif [ "$1" == "bash" ]; then
    cd laradock && ./sync.sh bash

elif [ "$1" == "install" ]; then
    print_style "Setting up Laradock environment\n" "info"
    cd laradock && cp env-example .env
    print_style "Project name (no spaces or special characters, eg: boyerwebstudios): "
    read project_name
    sed -i "s/REPLACE_WITH_PROJECT_NAME/$project_name/" .env
    ./sync.sh install

    print_style "If the project fails to run, double-check COMPOSE_PROJECT_NAME and DATA_PATH_HOST in laradock/.env \n" "info"

elif [ "$1" == "sync" ]; then
    cd laradock && ./sync.sh sync;

elif [ "$1" == "clean" ]; then
    cd laradock && ./sync.sh clean
else
    print_style "Invalid arguments.\n" "danger"
    display_options
    exit 1
fi