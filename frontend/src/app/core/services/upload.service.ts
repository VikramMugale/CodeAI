import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UploadService {
  private apiUrl = 'https://codeai-i3i8.onrender.com/api/upload';

  constructor(private http: HttpClient) {}

  uploadCodeFile(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post(`${this.apiUrl}`, formData);
  }
}
