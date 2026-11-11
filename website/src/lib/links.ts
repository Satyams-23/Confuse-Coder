import type { Account } from "./content";

export const YOUTUBE = "https://www.youtube.com/@ConfuseCoder23";

export const INSTAGRAM: Record<Account, string> = {
  confuse_coder: "https://www.instagram.com/confuse__coder/",
  "confuse_coder.dev": "https://www.instagram.com/confuse__coder.dev/",
};

/*
  Direct link to each reel, keyed "<account>/<notes file name>".
  Paste the reel / YouTube Short URL here after posting. Notes without an entry
  link to the channel / profile instead.
  e.g. "confuse_coder/12_merge_sort": { youtube: "https://youtube.com/shorts/xxxx", instagram: "https://www.instagram.com/reel/xxxx/" },
*/
const yt = (id: string) => `https://www.youtube.com/shorts/${id}`;
const ig = (code: string) => `https://www.instagram.com/reel/${code}/`;

export const VIDEO_LINKS: Record<string, { youtube?: string; instagram?: string }> = {
  "confuse_coder/05_recursion_tree": { youtube: yt("oLXHxU5-ggs"), instagram: ig("DfbXgDWsvgl") },
  "confuse_coder/06_memoization": { youtube: yt("Fin3SBsbmNQ"), instagram: ig("DfeLbemgbc1") },
  "confuse_coder/07_tabulation": { youtube: yt("qMSHPgSkAaI"), instagram: ig("DfiGqFAAzon") },
  "confuse_coder/08_take_skip_subsets": { youtube: yt("YsRkdJNPEQQ"), instagram: ig("DfjeyONg5Bi") },
  "confuse_coder/09_permutations": { youtube: yt("RUwBym-vwTE"), instagram: ig("Dfken6ZSazX") },
  "confuse_coder/10_n_queens": { instagram: ig("Dfl7NXPyIAv") },
  // 11_sudoku_solver, 12_merge_sort: not posted on YouTube / Instagram yet (checked 2026-11-11)
  "confuse_coder.dev/01_redis_seat_lock": { youtube: yt("CIeILRMDfm8"), instagram: ig("DfX3tXROKxT") },
  "confuse_coder.dev/02_vpn": { youtube: yt("eobbWtHXgzs"), instagram: ig("DfbX7AlNBpP") },
};

export function videoLinks(account: Account, slug: string) {
  const v = VIDEO_LINKS[`${account}/${slug}`] ?? {};
  return {
    youtube: v.youtube ?? YOUTUBE,
    instagram: v.instagram ?? INSTAGRAM[account],
    direct: { youtube: !!v.youtube, instagram: !!v.instagram },
  };
}
