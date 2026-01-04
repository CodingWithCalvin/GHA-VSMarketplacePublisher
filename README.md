# Visual Studio Marketplace Publisher

[![Build](https://img.shields.io/github/actions/workflow/status/CodingWithCalvin/GHA-VSMarketplacePublisher/build.yml?style=for-the-badge&label=Build)](https://github.com/CodingWithCalvin/GHA-VSMarketplacePublisher/actions/workflows/build.yml)
[![GitHub release](https://img.shields.io/github/v/release/CodingWithCalvin/GHA-VSMarketplacePublisher?style=for-the-badge)](https://github.com/CodingWithCalvin/GHA-VSMarketplacePublisher/releases)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)](LICENSE)

📦 Publish your Visual Studio extensions to the marketplace with ease!

This GitHub Action publishes your Visual Studio extension (.vsix) to the Visual
Studio Marketplace.

## 🚀 Usage

You can use the Visual Studio Marketplace Publisher GitHub Action by configuring
a YAML-based workflow file, e.g. `.github/workflows/deploy.yml`.

> ⚠️ **Note:** This action only works on a Windows-based runner.

## 📥 Inputs

| Input                   | Required | Description                                                  |
| ----------------------- | -------- | ------------------------------------------------------------ |
| `marketplace-pat`       | Yes      | Your Personal Access Token for the Visual Studio Marketplace |
| `publish-manifest-path` | Yes      | Path to your publish manifest (JSON file)                    |
| `vsix-path`             | Yes      | Path to the local VSIX package to publish                    |
| `vs-version`            | No       | Version of Visual Studio tooling to use (default: `latest`)  |
| `vs-prerelease`         | No       | Allow pre-release Visual Studio tooling (default: `false`)   |

## 📋 Example

Publish a local VSIX file:

```yaml
steps:
  - name: Checkout
    uses: actions/checkout@v4

  - name: Visual Studio Marketplace Publisher
    uses: CodingWithCalvin/GHA-VSMarketplacePublisher@v2
    with:
      # REQUIRED
      marketplace-pat: ${{ secrets.VS_MARKETPLACE_PAT }}
      publish-manifest-path: './src/vsixManifest.json'
      vsix-path: './src/outputFolder/Extension.vsix'

      # OPTIONAL
      vs-version: latest
      vs-prerelease: false
```

## 👥 Contributors

<!-- readme: contributors -start -->

[![CalvinAllen](https://avatars.githubusercontent.com/u/41448698?v=4&s=64)](https://github.com/CalvinAllen)

<!-- readme: contributors -end -->

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.

---

Made with ❤️ by Coding With Calvin
