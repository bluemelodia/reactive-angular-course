import { AfterViewInit, Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { FormBuilder, Validators, FormGroup } from "@angular/forms";
import * as moment from 'moment';

import { Course } from "../model/course";
import { CoursesService } from '../services/courses.service';
import { LoadingService } from '../loading/loading.service';

@Component({
	selector: 'course-dialog',
	templateUrl: './course-dialog.component.html',
	styleUrls: ['./course-dialog.component.css'],
	providers: [
		LoadingService
	]
})
export class CourseDialogComponent implements AfterViewInit {

	form: FormGroup;

	course: Course;

	constructor(
		private coursesService: CoursesService,
		private fb: FormBuilder,
		public loadingService: LoadingService,
		private dialogRef: MatDialogRef<CourseDialogComponent>,
		@Inject(MAT_DIALOG_DATA) course: Course) {

		this.course = course;

		this.form = fb.group({
			description: [course.description, Validators.required],
			category: [course.category, Validators.required],
			releasedAt: [moment(), Validators.required],
			longDescription: [course.longDescription, Validators.required]
		});

	}

	ngAfterViewInit() {

	}

	save() {
		/* Contains the latest value for each property. */
		const changes = this.form.value;

		const saveCourse$ = this.loadingService.showLoaderUntilCompleted(this.coursesService.saveCourse(this.course.id, changes));

		saveCourse$
			.subscribe((val) => {
				/**
				* Distinguish this call from the call to
				* close the dialog without making modifications.
				*/
				this.dialogRef.close(val);
			});
	}

	close() {
		this.dialogRef.close();
	}

}
