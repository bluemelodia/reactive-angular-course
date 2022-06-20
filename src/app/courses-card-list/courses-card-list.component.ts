import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { filter, tap } from 'rxjs/operators';

import { CourseDialogComponent } from '../course-dialog/course-dialog.component';
import { Course } from '../model/course';

@Component({
	selector: 'courses-card-list',
	templateUrl: './courses-card-list.component.html',
	styleUrls: ['./courses-card-list.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class CoursesCardListComponent implements OnInit {
	@Input() courses: Course[];
	@Output() private coursesChanged = new EventEmitter();

	constructor(private dialog: MatDialog) { }

	ngOnInit(): void {
	}

	editCourse(course: Course) {
		const dialogConfig = new MatDialogConfig();

		dialogConfig.disableClose = true;
		dialogConfig.autoFocus = true;
		dialogConfig.width = "400px";

		dialogConfig.data = course;

		/* When we open a dialog, we get a reference to it. */
		const dialogRef = this.dialog.open(CourseDialogComponent, dialogConfig);

		/* Emits on dialog close. The dialog only emits on successful set. */
		dialogRef.afterClosed()
			.pipe(
				filter(val => !!val),
				tap(() => this.coursesChanged.emit())
			)
			.subscribe();
	}
}
