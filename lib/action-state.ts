export type ActionError = { status: "error"; message: string };

export type ActionResult = { status: "success" } | ActionError;

export const serverError: ActionError = {
  status: "error",
  message: "Something went wrong. Please try again.",
};

export const feedbackNotFound: ActionError = {
  status: "error",
  message: "This feedback no longer exists.",
};
