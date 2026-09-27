# Releasing

Package: `@travelonium/videojs-ab-loop`  
Repository: `https://github.com/travelonium/videojs-ab-loop`

The initial package is prepared as version 1.0.0. Publishing requires an npm account
with permission to publish under the `@travelonium` scope. A successful local build
or GitHub push does not publish to npm.

1. Update `package.json`, `package-lock.json`, `ABLoop.VERSION` in `src/index.js`, and
   `CHANGELOG.md` together. Update versioned examples when appropriate.
2. Run `npm ci`, `npm run check`, and `npm pack --dry-run`.
3. Run the demo and verify real playback, keyboard, touch, thumbnails and source changes.
4. Run `npm pack` and install that tarball in a separate consumer to verify bundler usage.
5. Commit the release changes, push, and wait for GitHub CI to pass.
6. Sign in with `npm login` and run `npm publish --access public` after reviewing the
   package contents. This invokes the checks and builds the package again.
7. Tag the published commit with `git tag v1.0.0` (using the released version), then
   push the tag. Create a GitHub release with that tag, the changelog entry, and the
   generated `.tgz` as a downloadable asset.

CI runs checks and pack validation only. It has no npm token and does not publish
packages or create releases automatically.
