import { BE_ENDPOINT } from "@/lib/constants";
import { FormState } from "@/lib/types/formState";
import { registerSchema } from "@/lib/validations/registerSchema";
import { redirect } from "next/navigation";

export async function Register(
  state: FormState,
  formdata: FormData
): Promise<FormState> {
  const validationFields = registerSchema.safeParse({
      name: formdata.get("name"),
      username: formdata.get("username"),
      password: formdata.get("password"),
  });
  
  // If validation fails, return the validation errors
  if (!validationFields.success) {
      return {
          error: validationFields.error.flatten().fieldErrors,
          message: undefined 
      };
  }
  
  try {
      const response = await fetch(`${BE_ENDPOINT}/auth/register`, {
          method: "POST",
          headers: {
              "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(validationFields.data),
      });
      console.log(response);
      
      if (response.ok) {
          // Successful registration - redirect to login
          redirect("/auth/login");
          // Code below won't execute due to redirect
          return state;
      } else {
          const errorData = await response.json();
          return {
              error: undefined, 
              message: response.status === 409
                  ? errorData.message || "Username already exists"
                  : errorData.message || response.statusText,
          };
      }
  } catch (error) {
      return {
          error: undefined, 
          message: "An unexpected error occurred. Please try again later."
      };
  }
}