import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Submission } from '../../shared/models/submission.model';

@Injectable({
  providedIn: 'root',
})
export class ReviewService {
  private apiUrl = 'https://codeai-i3i8.onrender.com/api/review';




  constructor(private http: HttpClient) {}

  runCodeReview(submissionId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${submissionId}`);
  }

  getSubmissionById(id: string): Observable<Submission> {
    return this.http.get<Submission>(`http://localhost:5000/api/submissions/${id}`);
  }
}
