import { atomWithStorage } from 'jotai/utils';

// window.matchMedia("(prefers-color-scheme: dark)").matches
// export const themeAtom = atomWithStorage<'system' | 'light' | 'dark'>('theme', 'system');

export const themeAtom = atomWithStorage('theme', true);
