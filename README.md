# Happy Hour with Dennis and Erik

## [happyhour.fm](https://happyhour.fm)

[![Art](public/art.jpg)](https://happyhour.fm)

## Development

- `pnpm install`
- `pnpm generate-media-manifest`
- `pnpm build`

## Cloudflare deployment

- Production deploys run from `.github/workflows/deploy-cloudflare.yml` on every push to `master`.
- Add these GitHub repository secrets before the first deploy:
- `CLOUDFLARE_ACCOUNT_ID`
- `CLOUDFLARE_API_TOKEN`
- The Cloudflare token needs permission to deploy Pages and write objects to the `happyhour-media` R2 bucket.
- The workflow regenerates `data/media-manifest.json`, uploads changed `public/media/*.mp3` files to R2, and deploys the static export in `out/` to Cloudflare Pages.
- Attach both `happyhour.fm` and `www.happyhour.fm` to the Pages project.
- Keep `public/media` artwork in the repo; the build now excludes only `public/media/*.mp3`.
- Commit new episode MP3s before pushing to `master` so the workflow can upload them to R2 automatically.
- Refresh `data/media-manifest.json` with `pnpm generate-media-manifest` before removing a local MP3 from `public/media`.
