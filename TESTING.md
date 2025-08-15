# Testing the Docker Configuration

To test your Docker configuration changes, follow these steps:

1. Rebuild and restart your Docker containers:

```bash
docker-compose down
docker-compose build
docker-compose up -d
```

2. Configure your DNS settings according to the instructions in HOST-DNS-SETUP.md

3. Test that DNS resolution is working:

```bash
ping pan-samochodzik.test
```

If successful, you should see responses from 127.0.0.1.

4. Open your browser and navigate to:

```
http://pan-samochodzik.test
```

You should see your application running.

## Troubleshooting

If you're still experiencing issues:

1. Check the Docker logs:

```bash
docker-compose logs
```

2. Ensure all containers are running:

```bash
docker-compose ps
```

3. Verify your DNS configuration:

```bash
nslookup pan-samochodzik.test
```

4. Check that the port mapping is correct:

```bash
docker-compose port app 6969
```

5. If you continue to have issues with DNS resolution, try adding an entry to your hosts file as described in the HOST-DNS-SETUP.md file.

If all these steps fail, consider trying the podman solution as an alternative approach.
