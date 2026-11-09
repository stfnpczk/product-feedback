export const newFeedbackHref = "/feedback/new";

export function feedbackHref(id: number) {
  return `/feedback/${id}`;
}

export function editFeedbackHref(id: number) {
  return `/feedback/${id}/edit`;
}
