import {HorarioMateria} from "./horario-materia";

export interface Horario {
  _id?: string;
  carrera: string;
  opcion?: number;
  comentario?: string;
  horario: HorarioMateria[];
  tipo: string;
}
