export interface IDbScore {
  adv: number;
  bas: number;
  sub: string;
}

export interface IDbPreference {
  coll: string;
  cour: string;
  pos: number;
}

export interface IDbMult {
  adv: number;
  bas: number;
}

export interface IDbCourse {
  Multipliers: Map<string, IDbMult>;
  capacity: number;
  desc: string;
  enrolled: number;
  name: string;
}
