import { HorarioMateria } from "./horario-materia";

export interface Materia {
    sigla: string;
    asignatura: string;
    semestre: number;
    paralelos?: HorarioMateria[]; 
}
