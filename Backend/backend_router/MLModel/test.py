from PIL import Image
from MLapp import predict_disease

img = Image.open(r"E:\CropDises\Datasets\CorrectClassifiedDataset(RiceDises)\Brown Spot\1.jpg")

result = predict_disease(img)

print(result)