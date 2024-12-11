import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, signal, ViewChild } from '@angular/core';
import { FormGroup, FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialog } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';

import { AccessibleFormCreateComponent } from '../accessible-form-create/accessible-form-create.component';
import { AccessibleFormCancelComponent } from '../accessible-form-cancel/accessible-form-cancel.component';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';

import moment from 'moment';
import 'moment/locale/th';
import { AcsService } from '@core/services/acs.service';
import { RoleService } from '@core/services/role.service';
import { firstValueFrom, interval, Subject, Subscription } from 'rxjs';
import { AuthService } from '@core/services/auth.service';
import { NoDataComponent } from '@core/components/nodata/nodata.component';
import { LoadingIndicatorComponent } from '@core/components/loading/loading.component';
import { LoadingService } from '@core/components/loading/loading.service';


@Component({
  selector: 'app-accessible-list-getjob',
  standalone: true,
  templateUrl: './accessible-list-getjob.component.html',
  styleUrl: './accessible-list-getjob.component.scss',
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatMenuModule,
    MatDividerModule,
    MatChipsModule,
    MatTooltipModule,
    MatPaginatorModule,
    CommonModule,

    NoDataComponent,
    LoadingIndicatorComponent
  ],

})

export default class AccessibleListGetJobComponent {

  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;


  searchValue = "";
  searchTerm = new Subject<string>();
  departId = signal<number | null>(null);


  private subscription!: Subscription;

  // @Output() messageChange = new EventEmitter<string>();

  displayedColumns = [ 'go_date','go_time', 'equip','type_oi', 'quick', 'od_rem', 'wcode_staname','status_work','star'];
  // dataSource = new MatTableDataSource<TPatient>();
  dataSource = new MatTableDataSource<any>([]);


  constructor(
    private _acsService : AcsService,
    private dialog: MatDialog,
    private authService: AuthService,
    public _loadingService: LoadingService
  ) {

    moment.updateLocale('th', {
      longDateFormat: {
        LT: 'HH:mm',
        LTS: 'HH:mm:ss',
        L: 'DD/MM/YYYY',
        LL: 'D MMMM YYYY',
        LLL: 'D MMMM YYYY เวลา HH:mm',
        LLLL: 'วันddddที่ D MMMM YYYY เวลา HH:mm',
      },
      // Function to add 543 years to the Gregorian year
      postformat: (str: any) =>
        str.replace(/(\d{4})/g, (year: any) =>
          (parseInt(year, 10) + 543).toString()
        ),
    });
  }

  ngOnInit() : void{
    this.departId.set(this.authService.getDepartId());

    this.getAcsByWards();
    this.subscription = interval(60000).subscribe(() => {
      this.getAcsByWards();
    });

  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe(); // Clean up subscription
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

  }

  clearSearch() {
    this.searchValue = "";
    this.searchTerm.next("");

    this.dataSource.filter = '';

  }
  //โหลดข้อมูลรายการยา
  async getAcsByWards() {
    try {

      const response: any = await firstValueFrom(this._acsService.getAcsByWard(this.departId()!));
      this.dataSource.data = response.result;
      // this.data = response.result;
      // this.dataSource.paginator = this.paginator;

    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
    }
  }

  clickedJob(row:any){
    console.log('Clicked Job', row);

  }

  onButtonClick(row: any, event: Event) {
    event.stopPropagation();
    // console.log('Button clicked: ', row);
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(
      AccessibleFormCreateComponent,
      {
        data: {
          accessible_id: "",
          activity_name: "",
          activity_indicator: "",
          activity_amount: "",
        },
        width: "720px",
        disableClose: true
      }
    );

    dialogRef.afterClosed().subscribe((result) => {
      console.log("The dialog was closed");

      result === "ok" && this.getAcsByWards();
    });
  }

  openDialogCancel(Id:number): void {
    const dialogRef = this.dialog.open(
      AccessibleFormCancelComponent,
      {
        data: {
          Id: Id
        },
        width: "640px",
      }
    );

    dialogRef.afterClosed().subscribe((result) => {
      console.log("The dialog was closed");
      console.log("The dialog was closed");
      result === "ok" && this.getAcsByWards();
    });
  }

  ngAfterViewInit() {
    // this.getAcsByWards();
    // this.dataSource.data = this.data;
    this.dataSource.paginator = this.paginator;

  }

  //ฟังก์ชั่น: ปีภาษาไทย
  formatDateThai(date: Date): string {
    // return moment(date).format("LL"); // Customize the format as needed
    return moment(date).format("l"); // Customize the format as needed
  }



}
