import cloudinary
import cloudinary.uploader

def create_link(image_file, image_name):
    # Upload an image
    upload_result = cloudinary.uploader.upload(image_file,
                                            public_id=f"uploads/{image_name}")

    return upload_result["secure_url"]