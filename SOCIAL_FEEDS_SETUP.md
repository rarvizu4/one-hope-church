# One Hope Church: automatically updated YouTube videos

The Watch section now has **two matching video cards**:
- **Latest Livestream** (left): newest public church live broadcast/replay from YouTube's Live tab.
- **Latest Upload** (right): newest ordinary long-form video, such as Thursday Bible Study, from YouTube's Videos tab.

They are updated independently. Adding a regular video does not replace the livestream, and starting/publishing a livestream does not replace the latest regular upload. The embedded player opens in the existing modal on click.

## Refresh schedule

GitHub Actions workflow `.github/workflows/refresh-social.yml` checks approximately **every 30 minutes** (at :07 and :37, subject to GitHub scheduler delays). Website visitors read `data/youtube.json` from the public repository on load and about every five minutes while the page remains open. This is **automatic but not instantaneous**. YouTube may not expose a livestream in its public Live feed until after it ends or becomes public.

## How YouTube refresh works (no API key)

`social-sources.json` already contains the church's official channel handle `@iglesiaunaesperanza4112`. The refresh script tries to resolve the handle to the stable `UC...` channel ID, then reads two public Atom feeds. YouTube's special auto-playlist prefixes `UULV` (Live) and `UULF` (Videos) separate livestreams from uploads. These auto-playlist RSS URLs are an **undocumented YouTube convention**, and could stop working if YouTube changes its service.

To check the automation: open **GitHub → Actions → Refresh social feeds → Run workflow** and view the run log. Then open `data/youtube.json` and confirm there are two entries with `kind: "livestream"` and `kind: "upload"`.

If the automatic channel-handle lookup is blocked, sign in to the church's YouTube channel and get its exact 24-character ID in **YouTube Settings → Advanced settings** (or YouTube Studio), then put that value in `social-sources.json` as `youtubeChannelId`. Alternatively, set the GitHub Actions variable `YOUTUBE_CHANNEL_ID`. This avoids the handle-lookup step. No YouTube API key or paid service is necessary.

On temporary feed errors, the updater **preserves the previously displayed videos** rather than clearing the cards.

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
- For YouTube, if JSON is missing, empty, or the network request fails, both previously known video cards remain visible. For Instagram, the older Elfsight feed remains visible until the native Instagram feed is ready.
- The old YouTube Elfsight gallery was removed at the user's request; the Instagram Elfsight widget is kept as fallback.
- If GitHub Actions doesn't have write access, check the repo Actions settings and its branch protection rules.
- GitHub disables scheduled workflows in public repositories after long inactivity, and cron jobs are best effort rather than guaranteed at an exact minute.
