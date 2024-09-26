# CodingWithCalvin/GHA-VSMarketplacePublisher

Github Action to publish your Visual Studio extension to the marketplace

## Usage

You can use the VS Marketplace Publish GitHub Action by configuring a YAML-based
workflow file, e.g. .github/workflows/deploy.yml.

> _This action only works on a Windows-based runner_

## Publish a local VSIX File

```yml
steps:
  - name: Checkout
    uses: actions/checkout@v2

  - name: Visual Studio Marketplace Publisher
    uses: CodingWithCalvin/GHA-VSMarketplacePublisher@v2
    with:
      # REQUIRED
      marketplace-pat: ${{ secrets.vs_pat }}
      publish-manifest-path: ./src/vsixManifest.json
      vsix-path: ./src/outputFolder/Extension.vsix

      # OPTIONAL
      vs-version: latest
      vs-prerelease: false
```

## Inputs

| Input                 | Required | Description                                                                      |
| --------------------- | -------- | -------------------------------------------------------------------------------- |
| marketplace-pat       | Y        | Your 'Personal Access Token' to perform actions on the Visual Studio Marketplace |
| publish-manifest-path | Y        | Path to the manifest used for the publish                                        |
| vsix-path             | Y        | Path to the local VSIX package you wish to publish                               |
| vs-version            | N        | Specify the exact version of Visual Studio tooling to use; default to `latest`   |
| vs-prerelease         | N        | Allow a pre-release installation of Visual Studio tooling; default to `false`    |
