# Supabase Storage Integration for Product Images

This document explains how to set up and use the new Supabase storage functionality for product image uploads in the EStore admin panel.

## 🚀 Features Added

- **Direct Image Upload**: Upload images directly from the product form to Supabase storage
- **Drag & Drop Support**: Drag and drop images onto the upload area
- **URL Input Alternative**: Still support external URLs (Google Drive, etc.) as before
- **Image Management**: Set primary images, alt text, and sort order
- **Storage Indicators**: Visual indicators show which images are stored locally vs external URLs

## 📋 Prerequisites

1. **Supabase Project**: You need a Supabase project with storage enabled
2. **Storage Bucket**: Create a bucket named `product-images` in your Supabase storage
3. **Environment Variables**: Ensure these are set in your `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
NEXT_PUBLIC_ADMIN_SECRET_KEY=your_admin_secret
```

## 🗂️ Storage Bucket Setup

1. Go to your Supabase dashboard
2. Navigate to Storage → Buckets
3. Create a new bucket named `product-images`
4. Set the bucket to public (for image access)
5. Configure CORS if needed for your domain

## 🔧 Bucket Policies

Ensure your bucket has the correct policies for admin access:

```sql
-- Allow authenticated users to upload
CREATE POLICY "Allow authenticated uploads" ON storage.objects
FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Allow public read access to images
CREATE POLICY "Allow public read access" ON storage.objects
FOR SELECT USING (bucket_id = 'product-images');

-- Allow authenticated users to delete their uploads
CREATE POLICY "Allow authenticated deletes" ON storage.objects
FOR DELETE USING (auth.role() = 'authenticated');
```

## 📱 How to Use

### 1. Adding Images to Products

1. Go to Admin → Products
2. Create or edit a product
3. In the "Product Images" section:
   - **Drag & Drop**: Drag image files directly onto the upload area
   - **Click to Browse**: Click the upload area to select files from your computer
   - **Use URL**: Click "Use URL Instead" to enter external image URLs

### 2. Image Management

- **Set Primary Image**: Use the radio button to mark an image as primary
- **Alt Text**: Add descriptive text for accessibility
- **Sort Order**: Control the display order of images
- **Remove Images**: Click the remove button to delete images

### 3. Storage vs External URLs

- **Storage Images**: Show a green "Storage" badge and are uploaded to Supabase
- **External URLs**: Show no badge and remain as external links (Google Drive, etc.)

## 🛠️ Technical Implementation

### Files Created/Modified

- `lib/storage.ts` - Storage service for Supabase operations
- `app/api/admin/upload-image/route.ts` - API endpoint for image uploads
- `components/ui/image-upload.tsx` - Reusable image upload component
- `app/admin/products/page.tsx` - Updated product form with new image handling

### Storage Service Methods

```typescript
// Upload an image
await storageService.uploadImage(file, productId, fileName)

// Delete an image
await storageService.deleteImage(filePath)

// Check if URL is from storage
storageService.isStorageUrl(url)

// Get optimized image URL
storageService.getOptimizedImageUrl(filePath, { width: 800, quality: 80 })
```

## 🔒 Security Features

- **Admin Authentication**: Only authenticated admin users can upload/delete
- **File Type Validation**: Only image files (JPEG, PNG, WebP, GIF) allowed
- **File Size Limit**: Maximum 10MB per image
- **Product Isolation**: Images are stored in product-specific folders

## 📊 File Organization

Images are organized in storage as:
```
product-images/
├── product-id-1/
│   ├── product-id-1-1234567890.jpg
│   └── product-id-1-1234567891.png
└── product-id-2/
    └── product-id-2-1234567892.webp
```

## 🚨 Troubleshooting

### Common Issues

1. **Upload Fails**: Check admin authentication and bucket permissions
2. **Images Not Displaying**: Verify bucket is public and CORS is configured
3. **Storage Quota**: Monitor your Supabase storage usage

### Debug Steps

1. Check browser console for error messages
2. Verify environment variables are set correctly
3. Confirm bucket exists and is accessible
4. Check Supabase logs for storage errors

## 🔄 Migration from External URLs

Existing products with external image URLs will continue to work. To migrate to storage:

1. Edit each product
2. Remove the old image
3. Upload the same image using the new storage system
4. Save the product

## 📈 Performance Benefits

- **Faster Loading**: Local storage images load faster than external URLs
- **Better Control**: Manage image optimization and delivery
- **Reliability**: No dependency on external services
- **CDN**: Supabase storage can be served through CDN for global performance

## 🔮 Future Enhancements

- Image compression and optimization
- Multiple image formats (WebP, AVIF)
- Image cropping and resizing tools
- Bulk image upload
- Image search and tagging


