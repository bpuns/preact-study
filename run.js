function escapeArg(arg, quote) {
  arg = '' + arg
  if (!quote) {
    arg = arg.replace(/([\(\)%!\^<>&|;,"' ])/g, '^$1')
  } else {
    arg = arg.replace(/(\\*)"/gi, '$1$1\\"')
    arg = arg.replace(/(\\*)$/, '$1$1')
    arg = '"' + arg + '"'
  }
  return arg
}

function exec(command, args, options) {
  if (process.platform === 'win32') {
    command = command.replace(/([\(\)%!\^<>&|;, ])/g, '^$1')
    args = (args || []).map(function (arg) {
      return escapeArg(arg, command !== 'echo')
    })
    args = ['/s', '/c', '"' + command + (args.length ? ' ' + args.join(' ') : '') + '"']
    command = 'cmd'
    options = options || {}
    options.windowsVerbatimArguments = true
  }
  require('child_process').spawn(command, args, options)
}

const openProject = process.argv.slice(2)[0]
if (openProject) {
  exec('npx', ['lerna', 'exec', '--scope', openProject, '--', 'yarn', 'start'], { stdio: 'inherit' })
} else {
  console.error('命令执行格式错误，正式格式如下')
  console.log('npm run <package name>')
}