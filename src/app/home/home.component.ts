import { Component, OnInit } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { LoadingService } from '../loading/loading.service';
import { MessagesService } from '../messages/messages.service';
import { Course, sortCoursesBySeqNo } from '../model/course';
import { CoursesService } from '../services/courses.service';


@Component({
	selector: 'home',
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
	private courses$;

	public beginnerCourses$: Observable<Course[]>;
	public advancedCourses$: Observable<Course[]>;

	constructor(
		private coursesService: CoursesService,
		private loadingService: LoadingService,
		private messagesService: MessagesService,
	) {
	}

	/* Never call this method directly. */
	ngOnInit() {
		this.reloadCourses();
	}

	reloadCourses(): void {
		this.courses$ = this.coursesService.loadCourses()
			.pipe(
				map((courses: Course[]) => courses.sort(sortCoursesBySeqNo)),
				catchError((err) => {
					const message = 'Could not load courses.';
					this.messagesService.showErrors(message);

					console.log(message, err);

					return throwError(err);
				})
			);
		const loadCourses$ = this.loadingService.showLoaderUntilCompleted(this.courses$);

		this.beginnerCourses$ = loadCourses$
			.pipe(
				map((courses: Course[]) => courses.filter(course => course.category === 'BEGINNER'))
			);

		this.advancedCourses$ = loadCourses$
			.pipe(
				map((courses: Course[]) => courses.filter(course => course.category === 'ADVANCED'))
			);
	}
}




