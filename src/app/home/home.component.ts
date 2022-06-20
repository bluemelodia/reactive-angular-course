import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Course } from '../model/course';
import { CoursesStore } from '../services/courses.store';


@Component({
	selector: 'home',
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.css'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent implements OnInit {
	private courses$;

	public beginnerCourses$: Observable<Course[]>;
	public advancedCourses$: Observable<Course[]>;

	constructor(
		private coursesStore: CoursesStore,
	) {
	}

	/* Never call this method directly. */
	ngOnInit() {
		this.reloadCourses();
	}

	private reloadCourses(): void {
		this.beginnerCourses$ = this.coursesStore.filterByCategory('BEGINNER')
			.pipe(
				map((courses: Course[]) => courses.filter(course => course.category === 'BEGINNER'))
			);

		this.advancedCourses$ = this.coursesStore.filterByCategory('ADVANCED')
			.pipe(
				map((courses: Course[]) => courses.filter(course => course.category === 'ADVANCED'))
			);
	}
}




