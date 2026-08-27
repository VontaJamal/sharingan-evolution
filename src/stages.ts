interface EyeStageCopy {
  id: string;
  name: string;
  navName: string;
  lore: string;
  distinction: string;
  cue: string;
}

export type EyeStage = EyeStageCopy & (
  | { kind: 'dormant' }
  | { kind: 'tomoe'; tomoe: 1 | 2 | 3 }
  | { kind: 'mangekyo' }
  | { kind: 'eternal-mangekyo' }
  | { kind: 'rinnegan' }
);

export const SASUKE_STAGES = [
  {
    id: 'dormant',
    name: 'Dormant Eye',
    navName: 'Dormant',
    kind: 'dormant',
    lore: 'Before the dōjutsu awakens, the iris holds no tomoe.',
    distinction: 'Unawakened',
    cue: 'Awaken the eye',
  },
  {
    id: 'one-tomoe',
    name: 'One Tomoe Sharingan',
    navName: 'One Tomoe',
    kind: 'tomoe',
    tomoe: 1,
    lore: "Sasuke first awakened one tomoe on the night of the Uchiha clan's fall.",
    distinction: 'Sharingan · First awakening',
    cue: 'Draw out the second tomoe',
  },
  {
    id: 'two-tomoe',
    name: 'Two Tomoe Sharingan',
    navName: 'Two Tomoe',
    kind: 'tomoe',
    tomoe: 2,
    lore: 'Under mortal pressure, the maturing eye read movement with greater clarity.',
    distinction: 'Sharingan · Developing',
    cue: 'Complete the pattern',
  },
  {
    id: 'three-tomoe',
    name: 'Three Tomoe Sharingan',
    navName: 'Three Tomoe',
    kind: 'tomoe',
    tomoe: 3,
    lore: 'The Sharingan fully matured against Naruto in the Valley of the End.',
    distinction: 'Sharingan · Fully matured',
    cue: 'Break beyond the limit',
  },
  {
    id: 'mangekyo',
    name: 'Mangekyō Sharingan',
    navName: 'Mangekyō',
    kind: 'mangekyo',
    lore: "The truth of Itachi's sacrifice awakened Sasuke's unique Mangekyō.",
    distinction: 'Advanced Sharingan',
    cue: 'Seek the eternal light',
  },
  {
    id: 'eternal-mangekyo',
    name: 'Eternal Mangekyō Sharingan',
    navName: 'Eternal',
    kind: 'eternal-mangekyo',
    lore: "Itachi's transplanted eyes ended the Mangekyō's descent into blindness.",
    distinction: 'Eternal Sharingan',
    cue: 'Receive Six Paths power',
  },
  {
    id: 'six-paths-rinnegan',
    name: "Sasuke's Six Paths Rinnegan",
    navName: 'Rinnegan',
    kind: 'rinnegan',
    lore: "Hagoromo's Six Paths chakra transformed Sasuke's left eye into a six-tomoe Rinnegan.",
    distinction: 'Distinct dōjutsu · Left eye only',
    cue: 'Begin again',
  },
] as const satisfies readonly EyeStage[];

export type SasukeStage = (typeof SASUKE_STAGES)[number];
