const signupValidation = (name, value) => {
    // prevent errors when value is undefined
    if (!value) value = "";

    switch (name) {
        case "name":
            if (!value.trim()) return "Name is required.";
            return "";

        case "email":
            if (!value.trim()) return "Email is required.";
            if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value))
                return "Email is invalid.";
            return "";

        case "password":
            if (!value.trim()) return "Password is required.";
            if (
                !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,15}$/
                    .test(value)
            )
                return "Weak password — include upper, lower, number & symbol.";
            return "";

        case "confirmPassword":
            if (!value.trim()) return "Confirm your password.";
            return "";

        default:
            return "";
    }
};

const loginValidation = (name, value) => {
    if (!value) value = "";

    switch (name) {
        case "email":
            if (!value.trim()) return "Email is required.";
            return "";

        case "password":
            if (!value.trim()) return "Password is required.";
            return "";

        default:
            return "";
    }
};

export { signupValidation, loginValidation };
