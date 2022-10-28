export interface Album {
  title: string;
  artist: string;
  year: number;
  artwork: string;
  tracks: Track[];
}

export interface Track {
  title: string;
  artist: string;
  url: string;
  artwork: string;
}

export enum RepeatMode {
  DontRepeat = 0,
  RepeatAll,
  RepeatOne
}