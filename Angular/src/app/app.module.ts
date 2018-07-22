import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { Histogram } from './histogram/histogram.component'
import { Table } from './table/table.component'


import { AppComponent } from './app.component';
import { CommunicationService } from './communication.service';
import { HttpClientModule } from '@angular/common/http';
import { Ng2TableModule } from 'ng2-table/ng2-table';
import { PaginationModule } from "ngx-bootstrap/pagination";

@NgModule({
  declarations: [
    AppComponent,
    Histogram,
    Table
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    Ng2TableModule,
    PaginationModule.forRoot()
  ],
  providers: [CommunicationService],
  bootstrap: [AppComponent]
})
export class AppModule { }