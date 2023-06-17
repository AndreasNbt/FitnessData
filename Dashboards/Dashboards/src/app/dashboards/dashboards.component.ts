import { Component } from '@angular/core';
import { QueryService } from '../services/query.service';
import { map, tap, catchError } from 'rxjs';
import { formatDate } from '@angular/common';


@Component({
  selector: 'app-dashboards',
  templateUrl: './dashboards.component.html',
  styleUrls: ['./dashboards.component.css'],
})
export class DashboardsComponent {

  categories = ["Weight", "BMI", "Calories", "Activity", "Distance", "Steps", "Sleep"]

  query: string = "";
  queryResults: any[] = [];
  displayedColumns: string[] = [];

  people: string[] = [];
  selectedPerson: string = '';
  selectedCategory: string = '';

  startDate: Date = new Date(); 
  endDate: Date = new Date();

  chartData: any[] = [];

  ngOnInit() {
    // Fetch the list of people from the dataset
    //this.fetchPeople();
  }

  constructor(private queryService: QueryService) { }  
  
  fetchPeople() {
    this.queryService.executeQuery(this.query)
    .pipe(
      map(response => response.results.bindings),
      catchError(err => {
        throw 'Error. Details: ' + err;
      })
    )
    .subscribe()
  }
  
  
  submitQuery(): void {
    this.queryService.executeQuery(this.query)
    .pipe(
      map(response => response.results.bindings),
      tap(response => {
        this.queryResults = response;
        this.displayedColumns = Object.keys(this.queryResults[0]);

        this.chartData = this.processDataForChart(this.queryResults);

      }),
      catchError(err => {
        throw 'Error. Details: ' + err;
      })
    )
    .subscribe()
  }

  processDataForChart(data: any[]): any[] {
    const chartData = [];

    data.forEach(item => {
      console.log(item);
      chartData.push({
        name: item[this.displayedColumns[0]].value,
        value: item[this.displayedColumns[1]].value
      });
    });

    return chartData;
  }

}


