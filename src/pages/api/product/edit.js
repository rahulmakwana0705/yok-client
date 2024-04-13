import AWS from 'aws-sdk';
import multer from 'multer';
import Product from '../../../models/Products';
import s3 from '../../../lib/aws-config';

const upload = multer();

export const config = {
    api: {
        bodyParser: false,
    },
};

export default async function handler(req, res) {
    if (req.method === 'POST') {
        try {
            upload.fields([{ name: 'image', maxCount: 1 }, { name: 'gallery', maxCount: 10 }])(req, res, async (err) => {
                if (err) {
                    console.error('Error uploading files:', err);
                    return res.status(500).json({ message: 'Internal server error.' });
                }

                const { productId, name, description, sku, price, sale_price, type, quantity, category, tags, meta, variations, gender } = req.body;
                const variationsArray = JSON.parse(req.body.variations);
                const metaArray = JSON.parse(req.body.meta);

                const imageFile = req.files['image'] ? req.files['image'][0] : null;
                const galleryFiles = req.files['gallery'] || [];

                const uploadSingleImage = async () => {
                    if (!imageFile) return imageFile;

                    if (imageFile.startsWith('http://') || imageFile.startsWith('https://')) {
                        return imageFile;
                    }

                    const params = {
                        Bucket: process.env.NEXT_AWS_BUCKET_NAME,
                        Key: `${Date.now().toString()}-${imageFile.originalname}`,
                        Body: imageFile.buffer,
                        ContentType: imageFile.mimetype,
                        ACL: 'public-read',
                    };

                    try {
                        const data = await s3.upload(params).promise();
                        return data.Location;
                    } catch (error) {
                        console.error('Error uploading single image to S3:', error);
                        throw error;
                    }
                };

                const uploadGalleryImages = async () => {
                    if (!galleryFiles) return galleryFiles;
                    return Promise.all(
                        galleryFiles.map(async (file) => {
                            if (file.startsWith('http://') || file.startsWith('https://')) {
                                return file; // If file is a URL, return it directly
                            }
                            const params = {
                                Bucket: process.env.NEXT_AWS_BUCKET_NAME,
                                Key: `${Date.now().toString()}-${file.originalname}`,
                                Body: file.buffer,
                                ContentType: file.mimetype,
                                ACL: 'public-read',
                            };

                            try {
                                const data = await s3.upload(params).promise();
                                return data.Location;
                            } catch (error) {
                                console.error('Error uploading gallery image to S3:', error);
                                throw error;
                            }
                        })
                    );
                };

                const [imageUrl, galleryImageUrls] = await Promise.all([uploadSingleImage(), uploadGalleryImages()]);
                console.log('image ', imageUrl, galleryImageUrls);
                console.log('productId', productId);
                const product = await Product.findById(productId);

                if (!product) {
                    return res.status(404).json({ success: false, message: 'Product not found.' });
                }

                product.name = name;
                product.description = description;
                product.sku = sku;
                product.price = price;
                product.sale_price = sale_price;
                product.type = type;
                product.quantity = quantity;
                product.category = JSON.parse(category);
                product.tags = tags ? JSON.parse(tags) : [];
                product.variations = variationsArray.map((value, index) => ({
                    id: index + 1,
                    value: value.value,
                    attribute: {
                        id: 1,
                        name: value.attribute.name === 'Color' ? 'Color' : 'Size',
                        slug: value.attribute.slug === 'color' ? 'color' : 'size',
                    }
                }));
                product.meta = meta ? JSON.parse(meta) : [];
                product.gender = gender ? JSON.parse(gender) : [];
                product.image = { original: imageUrl, thumbnail: imageUrl, id: 1 };
                product.gallery = galleryImageUrls.map((url, index) => ({ original: url, thumbnail: url, id: index + 1 }));

                await product.save();

                res.status(200).json({ success: true, message: 'Product updated successfully.', product });
            });
        } catch (error) {
            // Handle errors
        }
    } else {
        res.status(405).json({ message: 'Method not allowed.' });
    }
}
