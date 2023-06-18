import { Component, ViewChild } from '@angular/core';
import { QueryService } from '../services/query.service';
import { map } from 'rxjs';
import { formatDate } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { Chart } from 'chart.js/auto';


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

  @ViewChild(MatPaginator) paginator: MatPaginator;

  categories = ["Weight", "BMI", "Calories", "Activity", "Distance", "Steps", "Sleep"]

  people: Person[] = [];
  fetchPeopleQuery = `PREFIX foaf: <http://xmlns.com/foaf/0.1/> PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> PREFIX : <http://test.org/FitnessData.owl#> SELECT * WHERE { ?Person a :Person . ?Person :personId ?PersonId . }`

  query: string;
  queryResults: MatTableDataSource<any>;
  queryResultsLength: number;
  displayedColumns: string[] = [];

  pageEvent: PageEvent;
  pageSizeOptions: number[] = [5, 10, 25, 50];
  pageSize = 5;
  currentPage = 0;
  
  showTable = false;
  emptyResult = false;

  selectedPerson: Person;
  selectedCategory: string;
  startDate: Date = new Date("1/1/2016"); 
  endDate: Date = new Date("1/1/2017");

  ngOnInit() {
    this.queryResults = new MatTableDataSource<any>;
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
          values.push({ name: person.Person.value.split('#')[1], id: person.PersonId.value });
        })
        return values;
      }),
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

    this.selectQuery(formattedStartDate, formattedEndDate);

    this.queryService.executeQuery(this.query)
      .pipe(
        map(response => response.results.bindings),
        map(response => {
          this.queryResultsLength = response.length;
          return response.slice(this.currentPage * this.pageSize, this.currentPage * this.pageSize + this.pageSize)
        }),
      )
      .subscribe(response => {
        this.queryResults = response;
        if (!this.queryResults) {
          this.emptyResult = true;
        }
        this.showTable = true;
        this.generateGraphs(this.queryResults);
      })
  }

  generateGraphs(data): void {
    
    const dateColumn = data.map(result => result.Date.value);
    const otherColumns = Object.keys(data[0]).filter(column => column !== 'Date');

    console.log(dateColumn);
    console.log(otherColumns);
  
    otherColumns.forEach(column => {
      const values = data.map(result => result[column].value);
      console.log(values);
  
      const chartCanvas = document.createElement('canvas');
      chartCanvas.classList.add('chart-canvas');
      chartCanvas.id = `chartCanvas-${column}`;
  
      const chartContainer = document.getElementById('chartContainer');
      chartContainer.appendChild(chartCanvas);
  
      const ctx = chartCanvas.getContext('2d');
  
      new Chart(ctx, {
        // Configure the chart with appropriate data and options
        type: 'line',
        data: {
          labels: dateColumn,
          datasets: [{
            label: column,
            data: values,
            // Customize the dataset options
          }]
        },
        
        // Additional chart options
      });
    });
  }
  

  handlePageEvent(e: PageEvent) {
    this.pageEvent = e;
    this.pageSize = e.pageSize;
    this.currentPage = e.pageIndex;
    this.submitQuery();
  }
  
  private selectQuery(formattedStartDate, formattedEndDate) {
    this.query = `PREFIX foaf: <http://xmlns.com/foaf/0.1/>
                PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
                PREFIX : <http://test.org/FitnessData.owl#>`;

    if (this.selectedCategory === 'Weight') {
      this.query += `SELECT ?Date ?WeightKg ?WeightPounds WHERE { ?Person a :Person ; :personId ${this.selectedPerson.id} . ?Observation a :Observation ; :observedPerson ?Person ; :hasResult ?Result . ?Result :hasWeightKg ?WeightKg ; :hasWeightPounds ?WeightPounds ; :resultTime ?Date . FILTER(?Date >= "${formattedStartDate}"^^xsd:dateTime && ?Date <= "${formattedEndDate}"^^xsd:dateTime) }`;
      this.displayedColumns = ["Date", "WeightKg", "WeightPounds"];
    } else if (this.selectedCategory === 'BMI') {
      this.query += `SELECT ?Date ?BMI WHERE { ?Person a :Person ; :personId ${this.selectedPerson.id} . ?Observation a :Observation ; :observedPerson ?Person ; :hasResult ?Result . ?Result :hasBMI ?BMI ; :resultTime ?Date . FILTER(?Date >= "${formattedStartDate}"^^xsd:dateTime && ?Date <= "${formattedEndDate}"^^xsd:dateTime) }`;
      this.displayedColumns = ["Date", "BMI"];
    } else if (this.selectedCategory === 'Calories') {
      this.query += `SELECT ?Date ?Calories WHERE { ?Person a :Person ; :personId ${this.selectedPerson.id} . ?Observation a :Observation ; :observedPerson ?Person ; :hasResult ?Result . ?Result :hasCaloriesBurned ?Calories ; :resultTime ?Date . FILTER(?Date >= "${formattedStartDate}"^^xsd:dateTime && ?Date <= "${formattedEndDate}"^^xsd:dateTime) }`;
      this.displayedColumns = ["Date", "Calories"];
    } else if (this.selectedCategory === 'Activity') {
      this.query += `SELECT ?Date ?SedentaryMinutes ?LightlyActiveMinutes ?FairlyActiveMinutes ?VeryActiveMinutes WHERE { ?Person a :Person ; :personId ${this.selectedPerson.id} . ?Observation a :Observation ; :observedPerson ?Person ; :hasResult ?Result . ?Result :hasSedentaryMinutes ?SedentaryMinutes ; :hasLightlyActiveMinutes ?LightlyActiveMinutes ; :hasFairlyActiveMinutes ?FairlyActiveMinutes ; :hasVeryActiveMinutes ?VeryActiveMinutes ; :resultTime ?Date . FILTER(?Date >= "${formattedStartDate}"^^xsd:dateTime && ?Date <= "${formattedEndDate}"^^xsd:dateTime) }`;
      this.displayedColumns = ["Date", "SedentaryMinutes", "LightlyActiveMinutes", "FairlyActiveMinutes", "VeryActiveMinutes"];
    } else if (this.selectedCategory === 'Distance') {
      this.query += `SELECT ?Date ?SedentaryActiveDistance ?LightlyActiveDistance ?ModeratelyActiveDistance ?VeryActiveDistance WHERE { ?Person a :Person ; :personId ${this.selectedPerson.id} . ?Observation a :Observation ; :observedPerson ?Person ; :hasResult ?Result . ?Result :hasSedentaryActiveDistance ?SedentaryActiveDistance ; :hasLightlyActiveDistance ?LightlyActiveDistance ; :hasModeratelyActiveDistance ?ModeratelyActiveDistance ; :hasVeryActiveDistance ?VeryActiveDistance ; :resultTime ?Date . FILTER(?Date >= "${formattedStartDate}"^^xsd:dateTime && ?Date <= "${formattedEndDate}"^^xsd:dateTime) }`;
      this.displayedColumns = ["Date", "SedentaryActiveDistance", "LightlyActiveDistance", "ModeratelyActiveDistance", "VeryActiveDistance"];
    } else if (this.selectedCategory === 'Steps') {
      this.query += `SELECT ?Date ?Steps WHERE { ?Person a :Person ; :personId ${this.selectedPerson.id} . ?Observation a :Observation ; :observedPerson ?Person ; :hasResult ?Result . ?Result :hasTotalSteps ?Steps ; :resultTime ?Date . FILTER(?Date >= "${formattedStartDate}"^^xsd:dateTime && ?Date <= "${formattedEndDate}"^^xsd:dateTime) }`;
      this.displayedColumns = ["Date", "Steps"];
    } else if (this.selectedCategory === 'Sleep') {
      this.query += `SELECT ?Date ?SleepRecords ?MinutesAsleep ?MinutesInBed WHERE { ?Person a :Person ; :personId ${this.selectedPerson.id} . ?Observation a :Observation ; :observedPerson ?Person ; :hasResult ?Result . ?Result :hasTotalSleepRecords ?SleepRecords ; :hasTotalMinutesAsleep ?MinutesAsleep ; :hasTotalTimeInBed ?MinutesInBed ; :resultTime ?Date . FILTER(?Date >= "${formattedStartDate}"^^xsd:dateTime && ?Date <= "${formattedEndDate}"^^xsd:dateTime) }`;
      this.displayedColumns = ["Date", "SleepRecords", "MinutesAsleep", "MinutesInBed"];
    }

  }

}


