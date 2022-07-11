# mse-poc-drools-repo
This repository is to maintain in version control the rules we develop & to sync them to the drools server

### Install dependencies

```
pnpm install
```

### Sync assets from/to Drools
- Modify config/.env.development appropriately
- Firstly, create a project `mse` of a space `jnj` in Business Central.
- To pull assets from Drools to this repository, run `pnpm pull-drools`.
- To push assets from this repository to Drools, run `pnpm push-drools`.
- To clean the temporary directory, run `pnpm clean-drools`.


