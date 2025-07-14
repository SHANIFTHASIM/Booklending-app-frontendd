import { cookies } from "next/headers";


export const TOKEN_NAME='auth-token'



export async function setToken(authToken: string) {
    const cookieStore = await cookies();
    const result = cookieStore.set({
    name: TOKEN_NAME,
    value: authToken,
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 30, // 30 days
    path: "/",
     
    });
    console.log("[setToken] Cookie set result:", result);

  } 


  export async function getToken(){
    const myAuthToken = (await cookies()).get(TOKEN_NAME);

    return myAuthToken ? myAuthToken.value : undefined;
}


export async function deleteTokens(){
    (await cookies()).delete(TOKEN_NAME)

    return (await cookies()).delete(TOKEN_NAME)
}
