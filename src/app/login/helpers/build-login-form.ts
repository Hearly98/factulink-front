import { FormControl, Validators } from "@angular/forms";
import { LoginForm } from "../core/types/login-form";

export const buildLoginForm = (): { 
    [K in keyof LoginForm]: FormControl<LoginForm[K]>;
} => {
    return {
        username: new FormControl(null, Validators.compose([Validators.required])),
        password: new FormControl(null, Validators.compose([Validators.required])),
    }
}