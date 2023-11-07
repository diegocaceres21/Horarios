import {HorarioMateria} from "./horario-materia";

export interface Horario {
  carrera: string;
  opcion?: number;
  comentario?: string;
  horario: HorarioMateria[];
}
