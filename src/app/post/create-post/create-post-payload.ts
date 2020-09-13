export class CreatePostPayload{
    postName: string;
    //The '?' is used to mark the parameter as optional. This is to make the variable of Optional type. 
    // Otherwise declared variables shows "undefined" if this variable is not used.
    // parameter?: type is a shorthand for parameter: type | undefined
    subredditName?: string;
    url?: string;
    description: string;
}