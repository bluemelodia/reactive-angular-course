import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, throwError } from "rxjs";
import { catchError, map, shareReplay, tap } from "rxjs/operators";

import { LoadingService } from "../loading/loading.service";
import { MessagesService } from "../messages/messages.service";
import { Course, sortCoursesBySeqNo } from "../model/course";

@Injectable({
	providedIn: 'root'
})
export class CoursesStore {
	private subject = new BehaviorSubject<Course[]>([]);
	public courses$: Observable<Course[]> = this.subject.asObservable();

	constructor(
		private http: HttpClient,
		private loading: LoadingService,
		private messages:MessagesService,
	) {
		this.loadAllCourses();
	}

	public filterByCategory(category: string): Observable<Course[]> {
		return this.courses$
			.pipe(
				map((courses) => courses.filter(course => course.category === category)
					.sort(sortCoursesBySeqNo)
				)
			)
	}

	public saveCourse(courseId: string, changes: Partial<Course>): Observable<any> {
		/* Get the most recent value emitted by the subject. */
		const courses = this.subject.getValue();
		const index = courses.findIndex(course => course.id === courseId);

		const newCourse: Course = {
			...courses[index], /* copy of the current version of the course. */
			...changes
		};

		const newCourses: Course[]  = courses.slice(0);
		newCourses[index] = newCourse;

		this.subject.next(newCourses); /* emit the new value. */
		
		/* modify on the backend. */
		return this.http.put(`/api/courses/${courseId}`, changes)
			.pipe(
				catchError(err => {
					const message = "Could not load courses.";
					this.messages.showErrors(message);
					console.log(message, err);
					return throwError(err);
				}),	
				shareReplay() /* prevent multiple subs to the Observable from making multiple HTTP request. */
			);
	}

	private loadAllCourses(): void {
		const loadCourses$ = this.http.get<Course[]>('/api/courses')
			.pipe(
				map(response  => response["payload"]),
				catchError(err => {
					const message = "Could not load courses.";
					this.messages.showErrors(message);
					console.log(message, err);
					return throwError(err);
				}),
				tap(courses => this.subject.next(courses))
			);
		
			this.loading.showLoaderUntilCompleted(loadCourses$)
				.subscribe();
	}
}