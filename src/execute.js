import child_process from 'child_process'
import _ from 'lodash'
import chalk from 'chalk'
import outputConsole from './output'

export default function execute (options) {
  const formatOptions = [
    '{{.ID}}', '{{.Names}}', '{{.Image}}', '{{.Command}}',
    '{{.CreatedAt}}', '{{.RunningFor}}', '{{.Status}}', '{{.Ports}}'
  ]
  const format = _.join(formatOptions, '\t')

  const output = child_process.execSync(`docker ps ${options} --format "${format}"`).toString()

  let containers = []

  for (let row of output.split('\n')) {
    if (row === '') continue
    const data = row.split('\t')
    let container = {
      id: data[0],
      name: data[1],
      image: data[2],
      command: data[3],
      createdAt: data[4],
      runningFor: data[5],
      status: data[6],
      ports: data[7]
    }
    containers.push(container)
  }

  if (containers.length === 0) {
    return chalk.magenta('There are no running containers.') + '\n' +
      `Use ${chalk.blue('-a, --all')} option to show all containers.`
  }

  return outputConsole(containers)
}