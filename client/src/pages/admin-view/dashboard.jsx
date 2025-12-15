import ProductImageUpload from "@/components/admin-view/image-upload";
import { Button } from "@/components/ui/button";
import {
  addFeatureImage,
  getFeatureImages,
  deleteFeatureImage,
} from "@/store/common";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

function AdminDashboard() {
  const [imageFile, setImageFile] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");
  const [imageLoadingState, setImageLoadingState] = useState(false);

  const dispatch = useDispatch();
  const { featureImageList } = useSelector((state) => state.commonFeature);

  function handleUploadFeatureImage() {
    if (!uploadedImageUrl) return;

    dispatch(addFeatureImage(uploadedImageUrl)).then((data) => {
      if (data?.payload?.success) {
        dispatch(getFeatureImages());
        setImageFile(null);
        setUploadedImageUrl("");
      }
    });
  }

  function handleDeleteFeatureImage(id) {
    dispatch(deleteFeatureImage(id));
  }

  useEffect(() => {
    dispatch(getFeatureImages());
  }, [dispatch]);

  return (
    <div className="space-y-6">
      {/* UPLOAD SECTION */}
      <ProductImageUpload
        imageFile={imageFile}
        setImageFile={setImageFile}
        uploadedImageUrl={uploadedImageUrl}
        setUploadedImageUrl={setUploadedImageUrl}
        setImageLoadingState={setImageLoadingState}
        imageLoadingState={imageLoadingState}
        isCustomStyling={true}
      />

      <Button
        onClick={handleUploadFeatureImage}
        className="w-full"
        disabled={imageLoadingState}
      >
        Upload Feature Image
      </Button>

      {/* FEATURE IMAGE LIST */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        {featureImageList && featureImageList.length > 0 ? (
          featureImageList.map((featureImgItem) => (
            <div
              key={featureImgItem._id}
              className="relative rounded-lg overflow-hidden border"
            >
              <img
                src={featureImgItem.image}
                className="w-full h-[250px] object-cover"
              />

              {/* DELETE BUTTON */}
              <Button
                variant="destructive"
                size="sm"
                className="absolute top-3 right-3"
                onClick={() => handleDeleteFeatureImage(featureImgItem._id)}
              >
                Delete
              </Button>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 col-span-full">
            No feature images uploaded yet
          </p>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;
