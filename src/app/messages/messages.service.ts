import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { filter } from "rxjs/operators";

@Injectable()
export class MessagesService {
	private subject = new BehaviorSubject<string[]>([]);
	public errors$ = this.subject.asObservable()
		.pipe(
			filter(messages => messages?.length > 0)
		);

	public showErrors(...errors: string[]): void {
		this.subject.next(errors);
	}
}