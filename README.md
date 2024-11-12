# OTP 2FA

Basic project where you have a 2FA verification code login with sent throw email.

## First Run

### Env

First clone the .env files

```bash
make clone-env
```

And edit the file with your required values

### Mailpit

Create a folder for Mailpit to save his database

```bash
make create-mailpit-folder
```

### Build docker

```bash
make start
```

This will:

* Download certificates for caddy proxy (todo list)
* build docker with no cache mode
* Up all docker services
