import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Course, sortCoursesBySeqNo } from '../model/course';
import { CoursesService } from '../services/courses.service';


@Component({
	selector: 'home',
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
	private courses$;

	/*
	private beginner$ = new Subject<Course[]>();
	private advanced$ = new Subject<Course[]>();

	public beginnerCourses$ = this.beginner$.asObservable();
	public advancedCourses$ = this.advanced$.asObservable();
	*/

	public beginnerCourses$: Observable<Course[]>;
	public advancedCourses$: Observable<Course[]>;

	constructor(
		private coursesService: CoursesService,
	) {
	}

	ngOnInit() {
		/*
		this.courses$ = this.coursesService.loadCourses()
			.pipe(
				map((courses: Course[]) => courses.sort(sortCoursesBySeqNo)),
				map((courses: Course[]) => {
					this.beginner$.next(courses.filter(course => course.category === 'BEGINNER'));
					this.advanced$.next(courses.filter(course => course.category === 'ADVANCED'));
				})
			)
			.subscribe();
		*/

		this.courses$ = this.coursesService.loadCourses()
			.pipe(
				map((courses: Course[]) => courses.sort(sortCoursesBySeqNo))
			);

		this.beginnerCourses$ = this.courses$
			.pipe(
				map((courses: Course[]) => courses.filter(course => course.category === 'BEGINNER'))
			);

		this.advancedCourses$ = this.courses$
		.pipe(
			map((courses: Course[]) => courses.filter(course => course.category === 'ADVANCED'))
		);
	}
}




