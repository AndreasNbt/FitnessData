import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


interface QueryResult {
  id: string;
  age: number;
  // ... add more properties as needed
}

@Injectable({
  providedIn: 'root'
})
export class QueryService {
  serverPort = 3000;
  private apiUrl = `http://localhost:${this.serverPort}/api/query`; // API endpoint for querying data

  constructor(private http: HttpClient) {}

  // Execute SPARQL query
  executeQuery(query: string): Observable<any> {
    return this.http.post<any>(this.apiUrl, {query: query} );
  }
}