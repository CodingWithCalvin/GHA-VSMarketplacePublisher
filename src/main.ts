import * as core from '@actions/core'
import * as exec from '@actions/exec/lib/exec'
import * as fs from 'fs'
import * as io from '@actions/io'
import * as path from 'path'
import {ExecOptions} from '@actions/exec/lib/interfaces'

const IS_WINDOWS = process.platform === 'win32'

const MARKETPLACE_PAT = core.getInput('marketplace-pat', {required: true})
const VS_VERSION = core.getInput('vs-version') || 'latest'
const VS_ALLOW_PRERELEASE = core.getInput('vs-prerelease') || 'false'

let PUBLISH_MANIFEST_PATH = core.getInput('publish-manifest-path', {
  required: true
})
let VSIX_PATH = core.getInput('vsix-path', {required: true})

async function run(): Promise<void> {
  try {
    if (IS_WINDOWS === false) {
      core.setFailed(
        'action-vs-marketplace-publish can only be run on Windows-based runners'
      )
      return
    }

    if (!fs.existsSync(PUBLISH_MANIFEST_PATH)) {
      PUBLISH_MANIFEST_PATH = path.join(
        process.env.GITHUB_WORKSPACE!,
        PUBLISH_MANIFEST_PATH
      )

      if (!fs.existsSync(PUBLISH_MANIFEST_PATH)) {
        core.setFailed(`No VSIX file at: '${PUBLISH_MANIFEST_PATH}'`)
        return
      }
    }

    if (!fs.existsSync(VSIX_PATH)) {
      VSIX_PATH = path.join(process.env.GITHUB_WORKSPACE!, VSIX_PATH)

      if (!fs.existsSync(VSIX_PATH)) {
        core.setFailed(`No publish manifest located at: '${VSIX_PATH}'`)
        return
      }
    }

    let vsWhereExe = ''

    try {
      vsWhereExe = await io.which('vswhere', true)
    } catch {
      vsWhereExe = path.join(
        process.env['ProgramFiles(x86)'] as string,
        'Microsoft Visual Studio\\Installer\\vswhere.exe'
      )
    }

    if (!fs.existsSync(vsWhereExe)) {
      core.setFailed(`This action requires the path to 'vswhere.exe' exists`)
      return
    }

    let foundToolPath = ''
    const options: ExecOptions = {}
    options.listeners = {
      stdout: (data: Buffer) => {
        const installationPath = data.toString().trim()

        const toolPath = path.join(
          installationPath,
          'vssdk\\VisualStudioIntegration\\tools\\bin\\VsixPublisher.exe'
        )

        if (!fs.existsSync(toolPath)) {
          core.setFailed(
            'Unable to locate the Visual Studio installation directory / location of VsixPublisher.exe '
          )
          return
        }

        foundToolPath = toolPath
      }
    }

    const VSWHERE_ARGS = [
      '-products',
      '*',
      '-requires',
      'Microsoft.Component.MSBuild',
      '-property',
      'installationPath',
      '-latest'
    ]

    if (VS_ALLOW_PRERELEASE === 'true') {
      VSWHERE_ARGS.push('-prerelease')
    }

    if (VS_VERSION !== 'latest') {
      VSWHERE_ARGS.push('-version')
      VSWHERE_ARGS.push(`"${VS_VERSION}"`)
    }

    // Figure out where VS is installed using VSWHERE.exe
    await exec.exec(`"${vsWhereExe}"`, VSWHERE_ARGS, options)

    // Now run the Vsix Publisher
    const VSIXPUBLISHER_ARGS = [
      'publish',
      '-payload',
      VSIX_PATH,
      '-publishManifest',
      PUBLISH_MANIFEST_PATH,
      '-personalAccessToken',
      MARKETPLACE_PAT
    ]
    await exec.exec(`"${foundToolPath}"`, VSIXPUBLISHER_ARGS)
  } catch (err: unknown) {
    if (err instanceof Error) {
      core.setFailed(err.toString())
    }
  }
}

run()
