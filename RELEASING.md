# Releasing

Package: `@travelonium/videojs-ab-loop`  
Repository: `https://github.com/travelonium/videojs-ab-loop`

## Automatic npm publication

Publishing a GitHub release triggers `.github/workflows/publish.yml`. The workflow
checks out that release's tag, validates the version, installs dependencies, then
runs `npm publish`. The package's `prepublishOnly` hook runs lint, all tests, the
build and distribution checks before publication. A failed check stops publishing.

Stable releases publish under npm's `latest` tag. GitHub prereleases publish under
`next` and must use a prerelease version such as `1.1.0-beta.1`. Draft releases,
ordinary commits and tag pushes alone do not publish. The workflow does not bump
versions or create GitHub releases.

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
2. Update `package.json`, `package-lock.json`, `ABLoop.VERSION` in `src/index.js`,
   and `CHANGELOG.md` together. Update versioned examples when appropriate.
3. Run `npm ci`, `npm run check`, and `npm pack --dry-run`.
4. Verify real playback, keyboard, touch, thumbnails and source changes in the demo.
5. Commit, push and wait for CI to pass. The release commit must contain `publish.yml`.
6. Create a GitHub release using a matching tag such as `v1.0.1`. For a prerelease,
   use a version such as `v1.1.0-beta.1` and mark it as a prerelease on GitHub.
7. Publish the GitHub release and check the **Publish to npm** Actions run.
8. Verify with `npm view @travelonium/videojs-ab-loop version` (or use the explicit
   version / `@next` for a prerelease).

If publication fails before npm accepts the version, fix the cause and re-run the
failed job when appropriate. If npm already accepted the version, do not re-run
publishing to replace it; release a new version for any changes. Publishing a
GitHub release for the existing 1.0.0 will fail with an already-published error.
