export function handleSuccessfulSubmit<T>(values: T) {
    console.log("Form submitted successfully")
    console.log("Values are : ", JSON.stringify(values, null, 2))
}