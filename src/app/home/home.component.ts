import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { LoadingService } from '../loading/loading.service';
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
		private loadingService: LoadingService,
	) {
	}

	/* Never call this method directly. */
	ngOnInit() {
		this.reloadCourses();
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
	}

	reloadCourses(): void {
		this.loadingService.loadingOn();

		this.courses$ = this.coursesService.loadCourses()
			.pipe(
				map((courses: Course[]) => courses.sort(sortCoursesBySeqNo)),
				finalize(() => this.loadingService.loadingOff())
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




