const path = require('path')
module.exports = {
  name: 'snapapp',
  run: async toolbox => {
    const { prompt, patching, system, filesystem } = toolbox

    const moveForward = await prompt.confirm(
      'Would you like to generate a snapshot of the current React app?'
    )
    if (!moveForward) return

    const packInfoPath = path.join(process.cwd(), 'package.json')
    const packInfo = require(packInfoPath)
    const mostRecent = packInfo.snapshots.slice(-1)

    // text input
    const askSnapName = {
      type: 'input',
      name: 'snapName',
      message: `The previous snapshot was named '${mostRecent}', what would you like to name this one?`
    }

    // ask a series of questions
    const questions = [askSnapName]
    const { snapName } = await toolbox.prompt.ask(questions)

    await patching.update(packInfoPath, config => {
      packInfo.snapshots.push(snapName)
      config.homepage = '/' + snapName
      config.snapshots = packInfo.snapshots
      return config
    })

    await system.run('yarn build')
    filesystem.move(
      path.join(process.cwd(), 'build'),
      path.join(process.cwd(), snapName)
    )

    console.log('Successfully completed snapshot - ' + snapName)
  }
}
