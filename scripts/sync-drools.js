require('esbuild-register/dist/node').register()

const { syncDrools } = require('..//src/DroolsRepository')

const syncDroolsCli = async (argv) => {
  const [commandId, ...commandArgv] = argv

  await syncDrools(commandId, commandArgv)
}

if (require.main === module) {
  syncDroolsCli(process.argv.slice(2)).catch((err) => {
    console.error(err)
    process.exit(1)
  })
}
