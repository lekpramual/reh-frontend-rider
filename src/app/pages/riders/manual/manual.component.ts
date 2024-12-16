import { Component, WritableSignal, inject, signal } from '@angular/core';
import { LoadingIndicatorComponent } from '@core/components/loading/loading.component';
import { WardService } from '@core/services/ward.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { MatCard } from '@angular/material/card';
import { MatDivider, MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { MatTableModule } from '@angular/material/table';
import { MatButton, MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { HttpClient } from '@angular/common/http';
import { AssetsService } from '@shared/services/assets.service';
import { saveAs } from "file-saver";

export interface ManualElement {
  name: string;
  position: number;
}

const ELEMENT_DATA: ManualElement[] = [
  {position: 1, name: 'คู่มือการใช้งานระบบขอใช้เปลออนไลน์ สำหรับ ไรด์เดอร์'},
 ];

@Component({
  selector: 'app-manual',
  standalone:true,
  templateUrl: './manual.component.html',
  styleUrl: './manual.component.scss',
  imports:[
    MatIconModule,
    MatCard,
    MatDivider,
    MatListModule,
    MatDividerModule,
    MatTableModule,
    MatButtonModule,
    MatTooltipModule
  ]

})
export default class ManualComponent {

  displayedColumns: string[] = ['position', 'name','actions'];
  dataSource = ELEMENT_DATA;

  constructor(public assets: AssetsService, private http: HttpClient) {}

   // ดาวน์โหลดคู่มือ
   downloadPdf() {
    const pdfUrl = this.assets.assets("doc/rider_docrider.pdf"); // Replace with the actual path to your PDF file

    this.http.get(pdfUrl, { responseType: "blob" }).subscribe((response) => {
      const blob = new Blob([response], { type: "application/pdf" });
      saveAs(blob, "rider_docrider_1.0.pdf");
    });
  }

}
