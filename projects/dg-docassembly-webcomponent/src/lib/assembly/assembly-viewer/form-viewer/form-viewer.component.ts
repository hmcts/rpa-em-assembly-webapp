import {
  Component,
  EventEmitter,
  Input, OnChanges,
  Output, SimpleChanges
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { Observable } from 'rxjs';
import { AssemblyService, ERROR } from '../../service/assembly.service';

@Component({
  selector: 'app-form-viewer',
  templateUrl: './form-viewer.component.html'
})
export class FormViewerComponent implements OnChanges {

  uiDefinition: Observable<FormlyFieldConfig[]>;
  form = new FormGroup({});
  outputFormat = 'PDF';
  documentUrl: string;
  error: string;

  @Input() templateName: string;
  @Input() templateData: any;
  @Input() outputFormats: string[];
  @Output() previewDocument = new EventEmitter();
  @Input() reusePreviewDocument = false;

  constructor(private assemblyService: AssemblyService) {
    this.outputFormat = this.outputFormats && this.outputFormats.length === 1 ? this.outputFormats[0] : 'PDF';
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.templateName) {
      this.uiDefinition = this.assemblyService.getUIDefinition(this.templateName);
    }
  }

  setOutputFormat(outputFormat: string) {
    this.outputFormat = outputFormat;
  }

  onPreview() {
    this.assemblyService
      .generateDocument(this.outputFormat, this.templateName, this.templateData, this.documentUrl)
      .subscribe(documentUrl => {
        if (documentUrl !== ERROR) {
          this.error = '';
          if (this.reusePreviewDocument) {
            this.documentUrl = documentUrl;
          }
          this.previewDocument.emit({
            templateData: this.templateData,
            documentUrl: documentUrl,
            outputFormat: this.outputFormat
          });
        } else {
          this.error = ERROR;
        }
      });
  }
}
