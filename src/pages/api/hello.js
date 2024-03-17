export default function handler(req, res) {
    // Get the data added in the middleware
    const dataFromMiddleware = req.dataFromMiddleware;
    console.log('Data from middleware:', dataFromMiddleware);

    res.status(200).json({ message: 'Hello from Next.js!', dataFromMiddleware });
}
