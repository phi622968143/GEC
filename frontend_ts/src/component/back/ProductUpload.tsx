import React from "react";
import axios from "axios";

const ProductUpload: React.FC = () => {
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    try {
      // Post product data
      const productData = new FormData();
      productData.append("name", formData.get("name") as string);
      productData.append("price", formData.get("price") as string);
      productData.append("brand", formData.get("brand") as string);
      productData.append("num", formData.get("num") as string);
      productData.append("description", formData.get("description") as File);
      productData.append("skill_lv", formData.get("skill_lv") as string);
      productData.append("category", formData.get("category") as string);

      const productResponse = await axios.post(
        "http://127.0.0.1:8000/api/product/post",
        productData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      alert("Product upload successful! Go into demo!");
      console.log("Product Uploaded:", productResponse.data);

      // Get the product ID from the response
      const productId = productResponse.data.id;

      // Post product image
      const imageData = new FormData();
      imageData.append("product", productId); // Include the product ID
      imageData.append("img", formData.get("img") as File);
      imageData.append("primary", formData.get("primary") ? "true" : "false");

      const imageResponse = await axios.post(
        "http://127.0.0.1:8000/api/img/post",
        imageData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      alert("Image upload successful! Go into demo!");
      console.log("Image Uploaded:", imageResponse.data);

      // Post product audio
      const audioData = new FormData();
      audioData.append("product", productId); // Include the product ID
      audioData.append("equipment", formData.get("equipment") as string);
      audioData.append("audio", formData.get("audio") as File);

      const audioResponse = await axios.post(
        "http://127.0.0.1:8000/api/audio/post",
        audioData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Audio Uploaded:", audioResponse.data);
      alert("Audio upload successful! Go into demo!");
      window.location.href = "http://localhost:3920/";
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div>
      <h1>Upload Product</h1>
      <form id="product-form" onSubmit={handleSubmit}>
        <h2>Product Information</h2>
        <label htmlFor="name">Name:</label>
        <input type="text" id="name" name="name" required />
        <br />

        <label htmlFor="price">Price:</label>
        <input type="number" id="price" name="price" required />
        <br />

        <label htmlFor="brand">Brand:</label>
        <input type="text" id="brand" name="brand" required />
        <br />

        <label htmlFor="num">Number:</label>
        <input type="number" id="num" name="num" required />
        <br />

        <label htmlFor="description">Description (File):</label>
        <input type="file" id="description" name="description" />
        <br />

        <label htmlFor="skill_lv">Skill Level:</label>
        <select id="skill_lv" name="skill_lv" required>
          <option value="beginner">Beginner</option>
          <option value="intermediate">Intermediate</option>
          <option value="advanced">Advanced</option>
        </select>
        <br />

        <label htmlFor="category">Category:</label>
        <select id="category" name="category" required>
          <option value="1">Electric Guitar</option>
          <option value="2">Amplifier</option>
          <option value="3">Effects Pedal</option>
          <option value="4">Gig Bag</option>
        </select>
        <br />

        <h2>Upload Product Image</h2>
        <label htmlFor="img">Image (File):</label>
        <input type="file" id="img" name="img" required />
        <br />

        <label htmlFor="primary">Primary Image:</label>
        <input type="checkbox" id="primary" name="primary" />
        <br />

        <h2>Upload Product Audio</h2>
        <label htmlFor="equipment">Equipment:</label>
        <input type="text" id="equipment" name="equipment" />
        <br />

        <label htmlFor="audio">Audio (File):</label>
        <input type="file" id="audio" name="audio" />
        <br />
        <button type="submit">Upload Product</button>
      </form>
    </div>
  );
};

export default ProductUpload;
