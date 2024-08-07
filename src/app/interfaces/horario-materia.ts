import {Horario} from "./horario";

export interface HorarioMateria {
    sigla: string;
    materia: string;
    docente?: string;
    paralelo: string;
    cupos?: number;
    inscritos?: number;
    disponibles?: number;
    horario: string;
    selected?: boolean;
    opciones?:Horario[];
    uve?: number;
}
