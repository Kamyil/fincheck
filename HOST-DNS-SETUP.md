# Host DNS Configuration for pan-samochodzik

To properly resolve the domain `pan-samochodzik.test` on your host system, you'll need to configure your DNS settings to use the dnsmasq container running in Docker.

## macOS Configuration

### Option 1: Using NetworkManager (Recommended)

1. Open System Preferences
2. Go to Network
3. Select your active network connection
4. Click "Advanced..." button
5. Go to the "DNS" tab
6. Click "+" to add a new DNS server
7. Add `127.0.0.1` as your first DNS server
8. Click "OK" and then "Apply"

### Option 2: Using /etc/hosts (Alternative)

If the DNS method doesn't work, you can edit your hosts file:

```bash
sudo nano /etc/hosts
```

Add the following line:

```
127.0.0.1 pan-samochodzik.test pan-samochodzik.local
```

Save and exit.

## Linux Configuration

### Option 1: Using NetworkManager

1. Edit your NetworkManager connection settings:
   ```bash
   sudo nano /etc/NetworkManager/system-connections/YOUR_CONNECTION_NAME
   ```
2. In the [ipv4] section, add:
   ```
   dns=127.0.0.1;8.8.8.8
   ```
3. Save and restart NetworkManager:
   ```bash
   sudo systemctl restart NetworkManager
   ```

### Option 2: Using /etc/hosts (Alternative)

Edit your hosts file:

```bash
sudo nano /etc/hosts
```

Add the following line:

```
127.0.0.1 pan-samochodzik.test pan-samochodzik.local
```

Save and exit.

## Testing the Configuration

After applying the changes, you can test if the DNS resolution is working:

```bash
ping pan-samochodzik.test
```

If successful, you should see responses from 127.0.0.1.

## Troubleshooting

1. If you're still having issues, make sure Docker is running
2. Ensure port 53 is not being used by another service on your host
3. Restart your Docker containers:
   ```bash
   docker-compose down
   docker-compose up -d
   ```
4. Check if dnsmasq is running properly:
   ```bash
   docker-compose logs dnsmasq
   ```

If you continue to have issues, consider using the `podman` alternative as mentioned previously.
