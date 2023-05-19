# add-npm-registry

Adds the specified registry to your npm configuration.

## Supported Registry Providers

### artifactory

```
Usage: add-npm-registry artifactory [options] <url> <email> <api key>

Configures npm to use an artifactory registry.

Options:
  --scope <scope>        e.g. @airbnb
  --location <location>  passed to `npm config` (default: "user")
```
