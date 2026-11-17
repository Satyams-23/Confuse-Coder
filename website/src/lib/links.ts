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
  "confuse_coder/10_n_queens": { youtube: yt("OOJ6Ru3BS10"), instagram: ig("Dfl7NXPyIAv") },
  // Instagram links below matched by caption on the profile grids, 2026-11-17; YouTube Short ids matched by title on @ConfuseCoder23/shorts
  "confuse_coder/11_sudoku_solver": { youtube: yt("jj_deCJvXLo"), instagram: ig("Dfoj6vxAiFt") },
  "confuse_coder/12_merge_sort": { youtube: yt("VW28pvbk9tg"), instagram: ig("Dfp5PUMCUYf") },
  "confuse_coder/13_combination_sum": { instagram: ig("DfrT-RCilIf") },
  "confuse_coder/14_word_search": { youtube: yt("00kwSenzU4o"), instagram: ig("DfusPCVAntj") },
  "confuse_coder/15_season_revision": { instagram: ig("DfwkuzZC55X") },
  "confuse_coder/graphs-01_what_is_a_graph": { youtube: yt("XnShN10BjYA"), instagram: ig("DfxCXKSCBmQ") },
  "confuse_coder/graphs-02_bfs": { youtube: yt("EfdEeaRYif8"), instagram: ig("DfzbHcSgBQU") },
  "confuse_coder.dev/01_redis_seat_lock": { youtube: yt("CIeILRMDfm8"), instagram: ig("DfX3tXROKxT") },
  "confuse_coder.dev/02_vpn": { youtube: yt("eobbWtHXgzs"), instagram: ig("DfbX7AlNBpP") },
  "confuse_coder.dev/04_data_leak_chain": { youtube: yt("i0xLqkfGBRM"), instagram: ig("DfmusHou5Pg") },
  "confuse_coder.dev/05_free_ai_vscode": { youtube: yt("DNxZroHvBZ0"), instagram: ig("Dfsdmfvi19R") },
  "confuse_coder.dev/06_microsoft_outage": { youtube: yt("j7ebIPE6ZoE"), instagram: ig("Dfu4llutSdj") },
  "confuse_coder.dev/08_cinematic_skill": { youtube: yt("WJUrgIYuSY8"), instagram: ig("DfzPGeLsxfl") },
  "confuse_coder.dev/10_clipping_reality": { youtube: yt("gHm1n9S9ixM"), instagram: ig("Df040wct-wW") },
  "confuse_coder.dev/11_gta6_clipping_cap": { youtube: yt("JG44eajimxE"), instagram: ig("Df1w_YwOrjH") },
  "confuse_coder.dev/12_free_clipping_tools": { instagram: ig("Df2Zy1tCvC-") },
};

export function videoLinks(account: Account, slug: string) {
  const v = VIDEO_LINKS[`${account}/${slug}`] ?? {};
  return {
    youtube: v.youtube ?? YOUTUBE,
    instagram: v.instagram ?? INSTAGRAM[account],
    direct: { youtube: !!v.youtube, instagram: !!v.instagram },
  };
}
