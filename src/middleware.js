import { NextResponse } from 'next/server';

export function middleware(request) {
    // Add data to the request object
    request.dataFromMiddleware = { message: 'jigar' };

    console.log("saxadaasda");
    console.log(request.dataFromMiddleware)

    // Call NextResponse.next() to pass the request to the next handler
    return NextResponse.next({ dataFromMiddleware: "adaat" });
}

export const config = {
    matcher: [
        '/test',
        '/api/hello',
    ],
};
