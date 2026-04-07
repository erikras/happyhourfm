# Happy Hour with Dennis and Erik

## [happyhour.fm](https://happyhour.fm)

[![Art](public/art.jpg)](https://happyhour.fm)

## Development

- `pnpm install`
- `pnpm build`

## Cloudflare deployment

- Production deploys run from `.github/workflows/deploy-cloudflare.yml` on every push to `master`.
- Add these GitHub repository secrets before the first deploy:
- `CLOUDFLARE_ACCOUNT_ID`
- `CLOUDFLARE_API_TOKEN`
- The Cloudflare token only needs permission to deploy Pages.
- Attach both `happyhour.fm` and `www.happyhour.fm` to the Pages project.
- Keep `public/media` artwork in the repo.

## Episode publishing

- Episode audio now lives only in Cloudflare R2 and is no longer committed to git.
- Log in locally with `pnpm exec wrangler login` before the first audio upload on a machine.
- Put a local MP3 in `public/media/<episode>.mp3`.
- Run `pnpm upload-audio-to-r2 public/media/<episode>.mp3`.
- Commit the updated `data/media-manifest.json`, show notes, and artwork.
- Push to `master` to deploy the site update to Cloudflare Pages.
