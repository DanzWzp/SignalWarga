export type FieldErrors = Record<string, string[] | undefined>;

export type ActionState = {
  status: "idle" | "success" | "error";
  message?: string;
  fieldErrors?: FieldErrors;
  reportId?: string;
};

export const initialActionState: ActionState = {
  status: "idle",
};

export function formDataToObject(formData: FormData) {
  return Object.fromEntries(formData.entries());
}
