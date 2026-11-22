import {loadFont as loadMukta} from '@remotion/google-fonts/Mukta';
import {loadFont as loadNoto} from '@remotion/google-fonts/NotoSansDevanagari';
import {loadFont as loadKalam} from '@remotion/google-fonts/Kalam';

// Devanagari-capable faces. Mukta = main lyric words, Noto = fallback, Kalam = small hand-written notes.
loadMukta('normal', {weights: ['700', '800'], subsets: ['devanagari', 'latin']});
loadNoto('normal', {weights: ['700', '800'], subsets: ['devanagari', 'latin']});
loadKalam('normal', {weights: ['700'], subsets: ['devanagari', 'latin']});
import {loadFont as loadTiro} from '@remotion/google-fonts/TiroDevanagariHindi';
import {loadFont as loadNotoSerif} from '@remotion/google-fonts/NotoSerifDevanagari';
loadTiro('normal', {weights: ['400'], subsets: ['devanagari', 'latin']});
loadNotoSerif('normal', {weights: ['500', '700', '800'], subsets: ['devanagari', 'latin']});
