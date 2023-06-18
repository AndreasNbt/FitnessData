import { Component } from '@angular/core';
import { QueryService } from '../services/query.service';
import { map, tap, catchError } from 'rxjs';
import { formatDate } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';

interface Person {
  name: string,
  id: number
}

@Component({
  selector: 'app-dashboards',
  templateUrl: './dashboards.component.html',
  styleUrls: ['./dashboards.component.css'],
})
export class DashboardsComponent {

  categories = ["Weight", "BMI", "Calories", "Activity", "Distance", "Steps", "Sleep"]

  people: Person[] = [];
  fetchPeopleQuery = `PREFIX foaf: <http://xmlns.com/foaf/0.1/>
                      PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
                      PREFIX : <http://test.org/FitnessData.owl#>
                      SELECT *
                      WHERE {
                          ?Person a :Person .
                          ?Person :personId ?PersonId .
                      }`

  query: string = "";
  queryResults: any[] = [];
  displayedColumns: string[] = [];
  emptyResult = false;

  
  selectedPerson: Person;
  selectedCategory: string = '';

  startDate: Date = new Date(); 
  endDate: Date = new Date();

  chartData: any[] = [];

  ngOnInit() {
    this.fetchPeople();
  }

  constructor(
    private queryService: QueryService,
    private snackBar: MatSnackBar
  ) { }  
  
  fetchPeople() {
    this.queryService.executeQuery(this.fetchPeopleQuery)
    .pipe(
      map(response => response.results.bindings),
      map(response => {
        let values: Person[] = [];
        response.forEach((person) => {
          values.push({ name: person.Person.value, id: person.PersonId.value });
        })
        return values;
      }),
      map(values => {
        let newValues: Person[] = [];
        values.forEach((value) => {
          newValues.push({ name: value.name.split('#')[1], id: value.id });
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
  
  submitQuery() {
    if (!this.selectedPerson || !this.selectedCategory || !this.startDate || !this.endDate) {
      this.snackBar.open('Please fill in all fields.', 'Close', { duration: 3000 });
      return;
    }

    const formattedStartDate = formatDate(this.startDate, 'yyyy-MM-dd', 'en');
    const formattedEndDate = formatDate(this.endDate, 'yyyy-MM-dd', 'en');

    

    this.query = `PREFIX foaf: <http://xmlns.com/foaf/0.1/>
                PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
                PREFIX : <http://test.org/FitnessData.owl#>`;

    if (this.selectedCategory === 'Weight') {
      this.query += `SELECT ?Date ?WeightKg ?WeightPounds WHERE { ?Person a :Person ; :personId ${this.selectedPerson.id} . ?Observation a :Observation ; :observedPerson ?Person ; :hasResult ?Result . ?Result :hasWeightKg ?WeightKg ; :hasWeightPounds ?WeightPounds ; :resultTime ?Date . FILTER(?Date >= "${formattedStartDate}"^^xsd:dateTime && ?Date <= "${formattedEndDate}"^^xsd:dateTime) }`;
      this.displayedColumns = ["Date", "WeightKg", "WeightPounds"];
    } else if (this.selectedCategory === 'BMI') {
      this.query = `SELECT ?date ?value WHERE { ?x :personId "${this.selectedPerson}" ; :date ?date ; :bmi ?value . FILTER(?date >= "${formattedStartDate}"^^xsd:date && ?date <= "${formattedEndDate}"^^xsd:date) }`;
    }
    // ...


    this.queryService.executeQuery(this.query)
      .pipe(
        map(response => response.results.bindings),
        catchError(err => {
          throw 'Error. Details: ' + err;
        })
      )
      .subscribe(response => {
        this.queryResults = response;
        if (this.queryResults.length === 0) {
          this.emptyResult = true;
        }
        console.log(this.queryResults);

        //this.chartData = this.processDataForChart(this.queryResults);)
      })
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


