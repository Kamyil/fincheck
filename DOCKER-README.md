# README - Docker Setup for pan-samochodzik

This document provides information about the Docker setup for the pan-samochodzik project.

## Configuration Files

The following files are important for the Docker configuration:

- `docker-compose.yml`: The main Docker Compose configuration file
- `Dockerfile`: Defines how the application container is built
- `dnsmasq.conf`: Configuration for DNS resolution
- `HOST-DNS-SETUP.md`: Instructions for configuring your host DNS
- `TESTING.md`: Instructions for testing the setup

## Issues Fixed

1. **Port Mismatch**: Fixed a port mismatch between the Dockerfile (which was exposing port 3000) and the Vite server configuration (which was using port 6969).

2. **DNS Configuration**: Enhanced the dnsmasq configuration to properly handle DNS resolution for the development domains.

## Testing Your Setup

Please follow the instructions in the `TESTING.md` file to test your setup after making these changes.

## Host System Configuration

For proper DNS resolution, you need to configure your host system as described in the `HOST-DNS-SETUP.md` file.

## Podman Alternative

If you continue to experience issues with the Docker setup, consider switching to Podman as discussed. Podman offers several advantages:

1. No daemon required
2. Rootless containers by default
3. Compatible with Docker Compose files
4. More straightforward networking in many cases
