# Releasing

Package: `@travelonium/videojs-ab-loop`  
Repository: `https://github.com/travelonium/videojs-ab-loop`

## Automatic npm publication

Publishing a GitHub release triggers `.github/workflows/publish.yml`. The workflow
checks out that release's tag, sets the package and plugin version from it, installs dependencies, then
runs `npm publish`. The package's `prepublishOnly` hook runs lint, all tests, the
build and distribution checks before publication. A failed check stops publishing.

Stable releases publish under npm's `latest` tag. GitHub prereleases publish under
`next` and must use a prerelease version such as `1.1.0-beta.1`. Draft releases,
ordinary commits and tag pushes alone do not publish. Tags may be `1.0.1` or `v1.0.1`. The workflow updates `package.json`,
`package-lock.json` and `ABLoop.VERSION` in the runner only; it does not commit
those changes back to Git or create GitHub releases.

## One-time npm trusted publisher setup

The package uses [npm trusted publishing](https://docs.npmjs.com/trusted-publishers/)
with GitHub OIDC and provenance. No `NPM_TOKEN` or GitHub secret is required.
The npm trusted publisher must match these settings exactly:

- Provider: GitHub Actions
- Organization/user: `travelonium`
- Repository: `videojs-ab-loop`
- Workflow filename: `publish.yml` (not the full path)
- Environment: leave blank
- Allowed action: direct `npm publish`

An npm package owner can configure it in the package's npm settings or with npm
11.15+ (interactive two-factor approval may be required):

```sh
npm trust github @travelonium/videojs-ab-loop \
  --repo travelonium/videojs-ab-loop --file publish.yml --allow-publish
npm trust list @travelonium/videojs-ab-loop
```

The workflow uses GitHub-hosted runners, Node.js 24, npm 11 and `id-token: write`.
Do not rename the workflow or move the repository without updating npm's trust
configuration.

## Release checklist

1. Choose a new version. npm versions are immutable; the already-published 1.0.0
   cannot be published again.
2. Update `CHANGELOG.md` and versioned examples. You may update the package and
   source versions locally too, but the release tag sets the published version.
3. Run `npm ci`, `npm run check`, and `npm pack --dry-run`.
4. Verify real playback, keyboard, touch, thumbnails and source changes in the demo.
5. Commit, push and wait for CI to pass. The release commit must contain `publish.yml`.
6. Create a GitHub release using a version tag such as `1.0.1` or `v1.0.1`. For a prerelease,
   use a version such as `v1.1.0-beta.1` and mark it as a prerelease on GitHub.
7. Publish the GitHub release and check the **Publish to npm** Actions run.
8. Verify with `npm view @travelonium/videojs-ab-loop version` (or use the explicit
   version / `@next` for a prerelease).

To retry an existing published release after fixing the workflow, open Actions →
Publish to npm → Run workflow, select the latest `master`, and enter the existing
release tag. This uses the latest publishing workflow with the original tagged
source. Draft or nonexistent releases are rejected. Re-running an old failed job
uses its old workflow, so use this manual trigger after a workflow fix. If npm already accepted the version, do not re-run
publishing to replace it; release a new version for any changes. Publishing a
GitHub release for the existing 1.0.0 will fail with an already-published error.
