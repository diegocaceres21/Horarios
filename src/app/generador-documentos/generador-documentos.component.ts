import { Component } from '@angular/core';
import {DocumentosService} from "../servicios/documentos.service";
import {FormControl, FormGroup} from "@angular/forms";

@Component({
  selector: 'app-generador-documentos',
  templateUrl: './generador-documentos.component.html',
  styleUrls: ['./generador-documentos.component.scss']
})
export class GeneradorDocumentosComponent {

  isSubmitted = false;
  datosLlenadosCompleto = false;
  mostrarDocumentosEntregados = false;
  isTraspaso = false;
  form: FormGroup = new FormGroup({
    nombre_completo: new FormControl(''),
    carnet: new FormControl(''),
    admision: new FormControl('2-2024'),
    carrera: new FormControl(''),
    titulo_legalizado_seduca: new FormControl(false),
    titulo_legalizado_gratis: new FormControl(false),
    titulo_simple: new FormControl(false),
    libreta: new FormControl(false),
    carnet_identidad: new FormControl(false),
    certificado: new FormControl(false),
    fotos: new FormControl(false),
  });
  llenadoManualActivado = false;
  constructor(private documentosService: DocumentosService) { }

  mostrarLlenadoManual(){
    this.llenadoManualActivado = true;
  }

  buscarPorCarnetDeIdentidad(){
    if(this.llenadoManualActivado){
      this.llenadoManualActivado = false;
    }
  }
  descargarCartaTraspaso(userId: string) {
    this.documentosService.obtenerCartaDeTraspaso(userId).subscribe(blob => {
      this.abrirDocumentoEnNavegador(blob)
    }, error => {
      console.error('Error downloading document:', error);
    });
  }

  descargarDocumentosEntregados() {
    const payload = {
      nombre_completo: "Diego Isaias Caceres Cortez",
      carnet: "E-10268053",
      admision: "1-2025",
      carrera: "Derecho",
      titulo_legalizado_seduca: true,
      titulo_legalizado_gratis: true,
      titulo_simple: false,
      libreta: false,
      carnet_identidad: true,
      certificado: true,
      fotos: true
    }
    this.documentosService.obtenerDocumentosEntregados(payload).subscribe(blob => {
      // Create a URL for the blob object
      this.abrirDocumentoEnNavegador(blob)
    }, error => {
      console.error('Error downloading document:', error);
    });
  }

  abrirDocumentoEnNavegador(blob: Blob){
    const url = window.URL.createObjectURL(blob);

    // Create an anchor element to trigger a download
    const a = document.createElement('a');
    a.href = url;
    a.download = 'generatedDocument.docx'; // Filename for the downloaded file
    a.click();

    // Open the document for printing
    window.open(url);

    // Cleanup: release the URL object
    window.URL.revokeObjectURL(url);
  }
}
