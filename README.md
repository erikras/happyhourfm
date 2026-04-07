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
- Put the show notes in `content/<episode>.md`.
- Put the MP3 in `public/media/<episode>.mp3`.
- Put the artwork in `public/media/<episode>.jpg` or `public/media/<episode>-*.jpg`.
- Run `pnpm publish-episode <episode>`.
- The script stages and commits only that episode’s show notes, artwork, and `data/media-manifest.json`, then pushes `master`.
- The script refuses to run if there are unrelated local git changes.
- Use `pnpm publish-episode --dry-run <episode>` to verify what would be uploaded and committed.
