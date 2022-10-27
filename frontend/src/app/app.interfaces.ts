export interface Album {
  title: string;
  artist: string;
  year: number;
  art: string;
  tracks: Track[];
}


export interface Track {
  title: string;
  artist: string;
  url: string;
}

export enum RepeatMode {
  DontRepeat = 0,
  RepeatAll,
  RepeatOne
}