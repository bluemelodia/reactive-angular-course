import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';

import { Course } from '../model/course';

@Injectable({
  providedIn: 'root'
})
export class CoursesService {
  constructor(private http: HttpClient) { }

  loadCourses(): Observable<Course[]> {
		return this.http.get<Course[]>('/api/courses')
			.pipe(
				map((res: Course[]) => res["payload"]),
				shareReplay()
			);
  }

  /**
   * 
   * @param courseId Uniquely identifies the course.
   * @param changes Avoids the consumer having to pass an entire
   * course instance - they can just pass the properties that they
   * want modified. This also maintains type safety.
   */
  saveCourse(courseId: string, changes: Partial<Course>): Observable<any> {
		return this.http.put(`/api/courses/${courseId}`, changes)
			.pipe(
				shareReplay()
			);
  }
}
