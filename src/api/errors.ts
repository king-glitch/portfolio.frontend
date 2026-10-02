/** Thrown by the service layer for an unknown id/slug; hooks render it as the empty state, never retry. */
export class NotFoundError extends Error {
	constructor(resource: string, id: string) {
		super(`${resource} not found: ${id}`);
		this.name = "NotFoundError";
	}
}
