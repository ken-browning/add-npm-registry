# add-npm-registry

A cli program that will update your npm configuration to use a private registry.

## Supported Registry Providers

### artifactory

```
Usage: add-npm-registry artifactory [options] <url> <email> <api key>

Adds an artifactory registry

Options:
  --scope <scope>
  --location <location>  passed to `npm config` (default: "user")
```
