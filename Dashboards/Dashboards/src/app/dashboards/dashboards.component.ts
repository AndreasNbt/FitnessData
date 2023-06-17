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

  people: string[] = [];
  fetchPeopleQuery = `PREFIX foaf: <http://xmlns.com/foaf/0.1/>
                      PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
                      PREFIX : <http://test.org/FitnessData.owl#>
                      SELECT *
                      WHERE {?Person a :Person}`

  query: string = "";
  queryResults: any[] = [];
  displayedColumns: string[] = [];

  
  selectedPerson: string = '';
  selectedCategory: string = '';

  startDate: Date = new Date(); 
  endDate: Date = new Date();

  chartData: any[] = [];

  ngOnInit() {
    this.fetchPeople();
  }

  constructor(private queryService: QueryService) { }  
  
  fetchPeople() {
    this.queryService.executeQuery(this.fetchPeopleQuery)
    .pipe(
      map(response => response.results.bindings),
      map(response => {
        let values = [];
        response.forEach((person) => {
          values.push(person.Person.value);
        })
        return values;
      }),
      map(values => {
        let newValues = [];
        values.forEach((value) => {
          newValues.push(value.split('#')[1]);
        })
        return newValues;
      }),
      
      catchError(err => {
        throw 'Error. Details: ' + err;
      })
    )
    .subscribe(response => {
      this.people = response;  
    })
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


