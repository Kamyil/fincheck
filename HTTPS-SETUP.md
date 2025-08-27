# HTTPS Setup for Local Development

This project includes HTTPS support for local development using self-signed certificates and Traefik reverse proxy.

## Quick Start

1. **Start the application**: `just start`
2. **Access via HTTPS**:
   - https://pan-samochodzik.test 🔒
   - https://pan-samochodzik.local 🔒
   - https://localhost 🔒

## Browser Security Warning

Since we use self-signed certificates, your browser will show a security warning. This is expected and safe for local development.

**To proceed:**

1. Click **"Advanced"** (Chrome/Edge) or **"Advanced..."** (Firefox)
2. Click **"Proceed to [site] (unsafe)"** or **"Accept the Risk and Continue"**

## How It Works

1. **Self-signed certificates** are generated in the `certs/` directory
2. **Traefik** acts as a reverse proxy with TLS termination
3. **HTTP traffic** is automatically redirected to HTTPS (308 Permanent Redirect)
4. **All domains** (localhost, _.test, _.local) use the same certificate

## Files Created

- `certs/cert.pem` - SSL certificate
- `certs/key.pem` - Private key
- `traefik/tls.yml` - Traefik TLS configuration

These files are gitignored and created automatically.

## Regenerating Certificates

If you need to regenerate certificates (e.g., they expired):

```bash
cd certs
openssl req -x509 -newkey rsa:4096 -keyout key.pem -out cert.pem -days 365 -nodes \
  -subj "/C=US/ST=Dev/L=Local/O=Pan-Samochodzik/CN=pan-samochodzik.test" \
  -addext "subjectAltName=DNS:pan-samochodzik.test,DNS:pan-samochodzik.local,DNS:localhost"
```

Then restart: `just restart-app`

## Production Note

This setup is only for local development. For production, use proper certificates from a trusted CA (Let's Encrypt, etc.).
