import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Course } from '../model/course';

@Injectable({
  providedIn: 'root'
})
export class CoursesService {
  constructor(private http: HttpClient) { }

  loadCourses(): Observable<Course[]> {
		return this.http.get<Course[]>('/api/courses')
			.pipe(
				map((res: Course[]) => res["payload"])
			);
  }
}
