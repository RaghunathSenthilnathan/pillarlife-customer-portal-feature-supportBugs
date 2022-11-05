# Amplify + React authentication

Integrating React with Amplify 

## How to Use

1. Clone the repository

2. Install the dependencies

```bash
npm run setup
```

3. Create the CDK stack

```bash
npm run cdk-create-stack
```

4. Open the AWS Console and the stack should be created in your default region

5. Start the react application and open `http://localhost:3000`. Note: it's
   important that you run the react application on `http://localhost:3000`,
   because that's the url we've set up CORS for.

```bash

export NODE_OPTIONS=--openssl-legacy-provider
npm run dev

```

6. Cleanup

```bash
npm run cdk-destroy
```

## Prod issue fix 

Check duplicate amplify version issue

https://docs.amplify.aws/lib/troubleshooting/upgrading/q/platform/js/

```

# Using YARN
yarn list --pattern amplify | \
  grep -o -e '@\?aws-amplify[^ ]*' | \
  sort | uniq | \
  sed -E 's/^(@?[^@]+).*$/\1/g' | \
  uniq -d | sort

# Using NPM
npm ls -all 2>/dev/null | \
  grep -o -e '@\?aws-amplify[^ ]*' | \
  sort | uniq | \
  sed -E 's/^(@?[^@]+).*$/\1/g' | \
  uniq -d | sort

```

## Prod issue fix upgrade amplify version

```bash

# Using YARN
yarn upgrade --latest --pattern aws-amplify


# Using NPM
npx npm-check-updates -i '/@?aws-amplify/' && npm update


```

```bash

npm install -g serve

npm run build

serve -l 3000 -s out

```
