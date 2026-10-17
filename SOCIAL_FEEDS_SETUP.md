# One Hope Church: faster social feeds

The website shows exactly one centered square for the newest public YouTube upload. A static copy of the latest known video is included so the section still displays one video if the feed is temporarily unreachable; the new video automatically replaces it once JSON refreshes. Instagram retains its existing Elfsight widget until the custom Instagram feed is authorized and has posts.

## How often does it refresh?

The GitHub Actions workflow `.github/workflows/refresh-social.yml` tries to check new content twice per hour, at minute 7 and 37. Scheduled Actions aren't exact and can be delayed or disabled by GitHub. The website checks the generated JSON when visitors open it and approximately every five minutes while open. Updates may be delayed by GitHub raw-file caching.

## Enable YouTube

1. The official church channel handle `@iglesiaunaesperanza4112` is already saved as `youtubeHandle` in `social-sources.json`.
2. Open **Actions → Refresh social feeds → Run workflow**, and run it once. The updater will attempt to resolve the handle from YouTube's public channel page, then fetch the public channel's RSS feed.
3. Verify that `data/youtube.json` contains the latest video. The website shows only that single video, even if older entries happen to remain in the data.
4. If YouTube blocks the channel-page lookup or its HTML changes, obtain the exact 24-character `UC...` channel ID through YouTube Studio (Settings → Channel → Advanced settings) and set `youtubeChannelId` in `social-sources.json` instead. Alternatively set a repository variable `YOUTUBE_CHANNEL_ID`. The stable ID takes precedence over the handle.

No YouTube API key is required. The workflow uses the public channel RSS feed. It shows recent uploads that appear in the channel's RSS, which may not include every livestream before it becomes a regular video.

## Enable Instagram

This requires a Business or Creator Instagram account with a Meta developer app, Instagram Login and an authorized access token with the `instagram_business_basic` permission. A personal Instagram account, a public profile link alone, or an Elfsight connection is not enough.

1. Authorize the church account through Meta's **Instagram API with Instagram Login**.
2. Obtain an appropriate authorized access token and set up any required refresh/renewal procedure. Do not paste tokens into website code, GitHub commits, public files, screenshots, or chat.
3. Go to **GitHub → Repository Settings → Secrets and variables → Actions → Secrets → New repository secret**.
4. Store the token as `INSTAGRAM_ACCESS_TOKEN`.
5. In **Actions → Refresh social feeds → Run workflow**, run it once.
6. Verify that `data/instagram.json` contains recent posts. The native Instagram gallery will then show automatically.

If the token expires, the existing data stays in place until reconnected. You will need to renew the token; it is not permanently self-renewing.

## Notes

- GitHub Actions commits made with `GITHUB_TOKEN` do **not** trigger GitHub Pages branch deployments.
- The native galleries read fresh JSON from `raw.githubusercontent.com/rarvizu4/one-hope-church/main/data/` via simple browser GET requests to bypass the Pages build delay. The social API secrets are never stored there.
- For YouTube, if JSON is missing, empty or the network request fails, the single most recently known video stays visible. For Instagram, the older Elfsight feed remains visible until the native Instagram feed is ready.
- The old YouTube Elfsight gallery was removed at the user's request; the Instagram Elfsight widget is kept as fallback.
- If GitHub Actions doesn't have write access, check the repo Actions settings and its branch protection rules.
- GitHub disables scheduled workflows in public repositories after long inactivity, and cron jobs are best effort rather than guaranteed at an exact minute.
